export type SupportTicket = {
  id: string;
  ticketId: string;
  username: string;
  subject: string;
  status: "New" | "In Progress" | "Resolved";
  submittedDate: string;
};
