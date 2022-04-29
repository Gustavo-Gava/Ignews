import { render, screen } from "@testing-library/react"
import Home from "../../pages"

const product = {
	priceId: "fake-price-id",
	amount: "R$ 300,00",
}

const session = {
	user: {
		name: "John Doe",
		email: "user@example.com",
		image: "image.jpg",
	},
	activeSubscription: true,
}

jest.mock("next-auth/client", () => {
	return {
		useSession() {
			return [session, false]
		},
	}
})

jest.mock("next/router")

describe("Home page", () => {
	it("should render correctly", () => {
		render(<Home product={product} />)

		expect(screen.getByText(`for ${product.amount} month`)).toBeInTheDocument()
	})

	it("should load initial data", () => {
		render(<Home product={product} />)
	})
})
