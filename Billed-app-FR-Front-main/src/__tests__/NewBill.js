/**
 * @jest-environment jsdom
 */

 import { fireEvent, screen } from "@testing-library/dom";
 import NewBillUI from "../views/NewBillUI.js";
 import NewBill from "../containers/NewBill.js";
 import mockStore from "../__mocks__/store";
 import { ROUTES, ROUTES_PATH } from "../constants/routes";
 import {localStorageMock} from "../__mocks__/localStorage.js";
 import userEvent from "@testing-library/user-event"
 import router from "../app/Router.js";
 
 jest.mock("../app/store", () => mockStore)




 describe("Given I am connected as an employee", () => {
  describe("When I submit a new Bill", () => {
    test("Then must save the bill", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
  
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee"
      }))
  
      document.body.innerHTML = NewBillUI()
  
      const newBillInit = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
  
      const formNewBill = screen.getByTestId("form-new-bill")
      expect(formNewBill).toBeTruthy()
      
      const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();
    })
  })
})

