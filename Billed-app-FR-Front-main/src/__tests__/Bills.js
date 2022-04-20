/**
 * @jest-environment jsdom
 */

 import {screen, waitFor, fireEvent} from "@testing-library/dom";
 import BillsUI from "../views/BillsUI.js";
 import { bills } from "../fixtures/bills.js"
 import { ROUTES,ROUTES_PATH } from "../constants/routes.js";
 import {localStorageMock} from "../__mocks__/localStorage.js";
 import mockStore from "../__mocks__/store";
 import "@testing-library/jest-dom";
 import Bills from "../containers/Bills.js";
 import userEvent from "@testing-library/user-event";
 import router from "../app/Router.js";


jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.className).toEqual('active-icon')
      //to-do write expect expression

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    describe('When i click on a eye btn to show the bill picture', () => {
      test('it show new bill form', async () => {
        localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        waitFor(() => screen.getByTestId('btn-new-bill'))
        const newBillContainer = screen.getByTestId('btn-new-bill')
        fireEvent.click(newBillContainer)
        expect(newBillContainer).toBeTruthy()
      })
    })
    describe("When I click on the eye icon", () => {
      test("Then show picture modal", async () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        Object.defineProperty(window, "localStorage", { value: localStorageMock })
        window.localStorage.setItem("user", JSON.stringify({
          type: "Employee"
        }))
        const newBills = new Bills({
          document, onNavigate, store: null, localStorage: window.localStorage
        })
        document.body.innerHTML = BillsUI({ data: bills })
        const handleClickIconEye = jest.fn((icon) => newBills.handleClickIconEye(icon));
        const iconEye = screen.getAllByTestId("icon-eye");
        const modaleFile = document.getElementById("modaleFile")
        $.fn.modal = jest.fn(() => modaleFile.classList.add("show"))
        iconEye.forEach((icon) => {
          icon.addEventListener("click", handleClickIconEye(icon))
          userEvent.click(icon)
          expect(handleClickIconEye).toHaveBeenCalled()
        })
        expect(modaleFile).toHaveClass("show")
      })
    })
    describe("When I click on NewBill Button", () => {
      // Vérifie si le formulaire de création de bills apparait
      test("Then the new bill form appear", async () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        Object.defineProperty(window, "localStorage", { value: localStorageMock })
        window.localStorage.setItem("user", JSON.stringify({
          type: "Employee"
        }))
        const newBills = new Bills({
          document, onNavigate, store: null, localStorage: window.localStorage
        })
        document.body.innerHTML = BillsUI({ data: bills })
        const handleClickNewBill = jest.fn(() => newBills.handleClickNewBill ())
        const btnNewBill = screen.getByTestId("btn-new-bill")
        btnNewBill.addEventListener("click", handleClickNewBill)
        userEvent.click(btnNewBill)
        expect(handleClickNewBill).toHaveBeenCalled()
        await waitFor(() => screen.getByTestId("form-new-bill"))
        expect(screen.getByTestId("form-new-bill")).toBeTruthy()
      })
    })
  })
})

 describe("When I navigate to Bill Page", () => {
    test("fetches bills from mock API GET", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee"
      }))
      new Bills({
        document, onNavigate, store: null, localStorage: window.localStorage
      })    
      document.body.innerHTML = BillsUI({ data: bills })
      await waitFor(() => screen.getByText("Mes notes de frais"))
      expect(screen.getByText("Mes notes de frais")).toBeTruthy()
    })
  })

  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    }) 
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})

      document.body.innerHTML = BillsUI({ error: "Erreur 404" })
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

        document.body.innerHTML = BillsUI({ error: "Erreur 500" })
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
    }) 
})



