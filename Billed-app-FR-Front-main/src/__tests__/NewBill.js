/**
 * @jest-environment jsdom
 */

import { getById, getByTestId, getByLabelText } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import NewBillUI from "../views/NewBillUI.js"
import { updateBill } from "../containers/NewBill.js"

/* beforeEach(() => {
  document.body.innerHTML = NewBillUI()
 
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    describe("When I submit new bill ", () => {
      it('should be send', () => {
        const file = new File(['Capture d’écran (4)'], 'Capture d’écran (4).png', {type: 'image/png'})

        userEvent.type(getByTestId(document.body, 'datepicker') , "01062020")
        userEvent.type(getByTestId(document.body, 'amount') , "111")
        userEvent.type(getByTestId(document.body, 'pct') , "111")
        userEvent.upload(getByTestId(document.body, 'amount'), file)
        userEvent.click(document.getElementById('btn-send-bill'))
        
      })
      
      
        
      
    })
  })
}) */
