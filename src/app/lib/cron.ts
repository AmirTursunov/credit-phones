import cron from "node-cron";
import connectDB from "./mongodb";
import Customer from "../models/Customer";
import PaymentNotification from "../models/PaymentNotification";
import { sendPaymentReminder } from "./email";

cron.schedule("0 9 * * *", async () => {
  console.log("To'lov eslatmalarini tekshirish...");
  try {
    await connectDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const customers = await Customer.find({
      "contracts.nextPaymentDate": { $gte: today, $lt: tomorrow },
      "contracts.status": "active",
    });

    for (const customer of customers) {
      for (const contract of customer.contracts) {
        const contractDate = new Date(contract.nextPaymentDate);
        contractDate.setHours(0, 0, 0, 0);

        if (
          contractDate.getTime() === today.getTime() &&
          contract.status === "active"
        ) {
          const result = await sendPaymentReminder(
            customer.email,
            customer.name,
            contract.phoneModel,
            contract.monthlyPayment,
            contract.nextPaymentDate.toLocaleDateString("uz-UZ")
          );

          if (result.success) {
            await PaymentNotification.create({
              customerId: customer._id,
              contractId: contract._id,
              paymentDate: contract.nextPaymentDate,
              amount: contract.monthlyPayment,
              sent: true,
              sentAt: new Date(),
            });
            console.log(`Email yuborildi: ${customer.email}`);
          }
        }
      }
    }
  } catch (error) {
    console.error("Xatolik:", error);
  }
});

console.log("Cron job ishga tushdi");
