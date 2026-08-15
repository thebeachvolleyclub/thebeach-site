export type DemoWebAccount = {
  email: string;
  name: string;
  description: string;
};

const DEMO_WEB_ACCOUNTS: readonly DemoWebAccount[] = [
  {
    email: "member-coach-youth@example.test",
    name: "Medlem, tränare och ungdom",
    description: "Personliga priser, aktivt medlemskap och 1 250 kr i saldo.",
  },
  {
    email: "nonmember@example.test",
    name: "Icke-medlem",
    description: "Ordinarie priser, inget medlemskap och inget saldo.",
  },
];

export function demoWebAccounts(environment: string | undefined): readonly DemoWebAccount[] {
  return environment?.trim().toLowerCase() === "demo" ? DEMO_WEB_ACCOUNTS : [];
}
