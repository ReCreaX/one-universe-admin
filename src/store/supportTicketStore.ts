// src/store/supportTicketStore.ts
import { create } from "zustand";
import { 
  supportService, 
  SupportTicketResponse, 
  SupportTicketStatus,
  SupportTicketsApiResponse 
} from "@/services/supportService";

// === Types ===
export interface SupportTicketFilters {
  status?: SupportTicketStatus;
  searchQuery?: string;
}

// === Helper: Type guard for HttpError ===
interface HttpError {
  error: true;
  message: string;
}

function isHttpError(response: unknown): response is HttpError {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    (response as any).error === true
  );
}

// === Store ===
interface SupportTicketState {
  // All tickets data
  tickets: SupportTicketResponse[];
  ticketsLoading: boolean;
  ticketsError: string | null;
  totalTickets: number;
  currentPage: number;
  totalPages: number;
  limit: number;

  // Selected ticket for detail view
  selectedTicket: SupportTicketResponse | null;
  selectedTicketLoading: boolean;
  selectedTicketError: string | null;

  // Filters
  filters: SupportTicketFilters;
  
  // Response submission state
  respondingToTicket: boolean;
  respondError: string | null;

  // Actions
  fetchTickets: (page?: number, limit?: number, status?: SupportTicketStatus) => Promise<void>;
  fetchTicketById: (ticketId: string) => Promise<void>;
  setSelectedTicket: (ticket: SupportTicketResponse | null) => void;
  respondToTicket: (ticketId: string, adminResponse: string) => Promise<boolean>;
  markAsResolved: (ticketId: string) => Promise<boolean>;
  updateTicketStatus: (ticketId: string, status: SupportTicketStatus) => Promise<boolean>;
  deleteTicket: (ticketId: string) => Promise<boolean>;
  setFilters: (filters: SupportTicketFilters) => void;
  clearFilters: () => void;
  clearSelectedTicket: () => void;
  clearRespondError: () => void;
}

export const supportTicketStore = create<SupportTicketState>((set, get) => ({
  tickets: [],
  ticketsLoading: false,
  ticketsError: null,
  totalTickets: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,

  selectedTicket: null,
  selectedTicketLoading: false,
  selectedTicketError: null,

  filters: {},
  
  respondingToTicket: false,
  respondError: null,

  fetchTickets: async (page = 1, limit = 10, status?: SupportTicketStatus) => {
    set({ ticketsLoading: true, ticketsError: null });

    try {
      const response: unknown = await supportService.getAllTickets({
        page,
        limit,
        status: status || undefined,
      });

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      const typedResponse = response as SupportTicketsApiResponse;

      set({
        tickets: typedResponse.data,
        totalTickets: typedResponse.total,
        currentPage: typedResponse.page,
        totalPages: typedResponse.pages,
        limit: typedResponse.limit,
        ticketsError: null,
      });
    } catch (err: any) {
      console.error("Failed to fetch tickets:", err);
      set({
        tickets: [],
        ticketsError: err.message || "Failed to load support tickets",
      });
    } finally {
      set({ ticketsLoading: false });
    }
  },

  fetchTicketById: async (ticketId: string) => {
    set({ selectedTicketLoading: true, selectedTicketError: null });

    try {
      const response: unknown = await supportService.getTicketById(ticketId);

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      const ticket = response as SupportTicketResponse;

      set({
        selectedTicket: ticket,
        selectedTicketError: null,
      });
    } catch (err: any) {
      console.error("Failed to fetch ticket details:", err);
      set({
        selectedTicket: null,
        selectedTicketError: err.message || "Failed to load ticket details",
      });
    } finally {
      set({ selectedTicketLoading: false });
    }
  },

  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),

  clearRespondError: () => set({ respondError: null }),

  respondToTicket: async (ticketId: string, adminResponse: string) => {
    set({ respondingToTicket: true, respondError: null });

    try {
      const { tickets } = get();
      const ticket = tickets.find(t => t.id === ticketId);
      
      if (!ticket) {
        throw new Error("Ticket not found in local list");
      }

      const response: unknown = await supportService.respondToTicket({
        ticketId: ticket.ticketId,
        adminResponse,
      });

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      const updatedTicket = response as SupportTicketResponse;

      // Update both list and selected ticket
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === updatedTicket.id ? updatedTicket : t
        ),
        selectedTicket: state.selectedTicket?.id === updatedTicket.id 
          ? updatedTicket 
          : state.selectedTicket,
        respondError: null,
      }));

      // Optional: Refetch full list to ensure sync (uncomment if needed)
      // await get().fetchTickets(get().currentPage, get().limit);

      return true;
    } catch (err: any) {
      console.error("Failed to respond to ticket:", err);
      set({
        respondError: err.message || "Failed to send response. Please try again.",
      });
      return false;
    } finally {
      set({ respondingToTicket: false });
    }
  },

  markAsResolved: async (ticketId: string) => {
    set({ respondingToTicket: true, respondError: null });

    try {
      const { tickets } = get();
      const ticket = tickets.find(t => t.id === ticketId);
      
      if (!ticket) {
        throw new Error("Ticket not found in local list");
      }

      const response: unknown = await supportService.markAsResolved(ticket.ticketId);

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      const updatedTicket = response as SupportTicketResponse;

      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === updatedTicket.id ? updatedTicket : t
        ),
        selectedTicket: state.selectedTicket?.id === updatedTicket.id 
          ? updatedTicket 
          : state.selectedTicket,
        respondError: null,
      }));

      return true;
    } catch (err: any) {
      console.error("Failed to mark ticket as resolved:", err);
      set({
        respondError: err.message || "Failed to mark as resolved. Please try again.",
      });
      return false;
    } finally {
      set({ respondingToTicket: false });
    }
  },

  updateTicketStatus: async (ticketId: string, status: SupportTicketStatus) => {
    set({ respondingToTicket: true, respondError: null });

    try {
      const { tickets } = get();
      const ticket = tickets.find(t => t.id === ticketId);
      
      if (!ticket) {
        throw new Error("Ticket not found in local list");
      }

      const response: unknown = await supportService.updateTicketStatus(ticket.ticketId, status);

      if (isHttpError(response)) {
        throw new Error(response.message);
      }

      const updatedTicket = response as SupportTicketResponse;

      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === updatedTicket.id ? updatedTicket : t
        ),
        selectedTicket: state.selectedTicket?.id === updatedTicket.id 
          ? updatedTicket 
          : state.selectedTicket,
        respondError: null,
      }));

      return true;
    } catch (err: any) {
      console.error("Failed to update ticket status:", err);
      set({
        respondError: err.message || "Failed to update status",
      });
      return false;
    } finally {
      set({ respondingToTicket: false });
    }
  },

  deleteTicket: async (ticketId: string) => {
    set({ respondingToTicket: true, respondError: null });

    try {
      const { tickets } = get();
      const ticket = tickets.find(t => t.id === ticketId);
      
      if (!ticket) {
        throw new Error("Ticket not found in local list");
      }

      const deleteResult = await supportService.deleteTicket(ticket.ticketId);

      if (isHttpError(deleteResult)) {
        throw new Error(deleteResult.message);
      }

      set((state) => ({
        tickets: state.tickets.filter((t) => t.id !== ticketId),
        selectedTicket: state.selectedTicket?.id === ticketId ? null : state.selectedTicket,
        respondError: null,
      }));

      return true;
    } catch (err: any) {
      console.error("Failed to delete ticket:", err);
      set({
        respondError: err.message || "Failed to delete ticket",
      });
      return false;
    } finally {
      set({ respondingToTicket: false });
    }
  },

  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
  clearSelectedTicket: () => set({ 
    selectedTicket: null, 
    selectedTicketError: null 
  }),
}));