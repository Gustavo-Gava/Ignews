import { render, screen } from "@testing-library/react"
import { mocked } from "jest-mock"
import { stripe } from "../../services/stripe"

import Home, { getStaticProps } from "../../pages"
import Stripe from "stripe"

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

jest.mock("../../services/stripe.ts")

describe("Home page", () => {
	it("should render correctly", () => {
		render(<Home product={product} />)

		expect(screen.getByText(`for ${product.amount} month`)).toBeInTheDocument()
	})

	it("should load initial data", async () => {
		const stripeMocked = mocked(stripe.prices.retrieve)

		stripeMocked.mockResolvedValueOnce({
			id: "fake-price-id",
			unit_amount: 1000,
		} as Stripe.Response<Stripe.Price>)

		const response = await getStaticProps({})

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					product: {
						priceId: "fake-price-id",
						amount: "$10.00",
					},
				},
			})
		)
	})
})
