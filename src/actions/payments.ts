export async function getStripeClientSecrete({ amount }: { amount: number }) {
  try {
    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Something went wrong" };
    }

    const data = await res.json();
    return { clientSecret: data.clientSecret };
  } catch (error: any) {
    return { error: error.message || "Internal error" };
  }
}
