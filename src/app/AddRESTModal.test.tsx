import React from "react"
import { screen } from "@testing-library/react"
import { render } from "./test-utils"
import { App } from "./App"
import {AddRESTModal} from "./AddRESTModal";

test("Make sure render has text Change REST Server", () => {
  render(<AddRESTModal />)
  const linkElement = screen.getByText(/Change REST Server/i)
  expect(linkElement).toBeInTheDocument()

})
