import { getCheckoutShippingOptions } from "@/lib/commerce/checkout-shipping"
import { resolveMarketFromCookies } from "@/lib/commerce/resolve-market-server"
import {
  CheckoutContent,
  type SerializedCheckoutShippingOption,
} from "./checkout-content"

export default async function CheckoutPage() {
  const resolvedMarket = await resolveMarketFromCookies()
  const shippingOptions = await getCheckoutShippingOptions(resolvedMarket.code)

  const serializedShipping: SerializedCheckoutShippingOption[] = shippingOptions.map(
    (option) => ({
      id: option.id,
      name: option.name,
      priceCents: option.price.amount,
      days: option.days,
      supportsParcelLocker: option.supportsParcelLocker,
    })
  )

  return (
    <CheckoutContent
      shippingOptions={serializedShipping}
      vatRateBps={resolvedMarket.vatRateBps}
      marketCode={resolvedMarket.code}
    />
  )
}