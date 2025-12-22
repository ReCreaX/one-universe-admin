/**
 * Updated SideBarLinks with module information
 * Matches your actual routes with permission modules
 */

export const SideBarLinksWithPermissions = [
  {
    id: 1,
    text: "Dashboard",
    link: "/admin",
    module: "Dashboard",
    isDropDown: false,
    activeImage: "/dashboard/active/dashboard.svg",
    inActiveImage: "/dashboard/inactive/dashboard.svg",
  },
  {
    id: 2,
    text: "Users Management",
    link: "/admin/users-management",
    module: "User Management",
    isDropDown: false,
    activeImage: "/dashboard/active/users-management.svg",
    inActiveImage: "/dashboard/inactive/users-management.svg",
  },
  {
    id: 3,
    text: "Payment Management",
    link: "/admin/payment-management",
    module: "Payment Management",
    isDropDown: false,
    activeImage: "/dashboard/active/payment-management.svg",
    inActiveImage: "/dashboard/inactive/payment-management.svg",
  },
  {
    id: 4,
    text: "Dispute Management",
    link: "/admin/dispute-management",
    module: "Dispute",
    isDropDown: false,
    activeImage: "/dashboard/active/dispute-management.svg",
    inActiveImage: "/dashboard/inactive/dispute-management.svg",
  },
  {
    id: 5,
    text: "Service Management",
    link: "/admin/service-management",
    module: "Service Management",
    isDropDown: false,
    activeImage: "/dashboard/active/service-management.svg",
    inActiveImage: "/dashboard/inactive/service-management.svg",
  },
  {
    id: 6,
    text: "Promotional Offers",
    link: "/admin/promotional-offers",
    module: "Promotional Offers",
    isDropDown: true,
    activeImage: "/dashboard/active/promotional-offers.svg",
    inActiveImage: "/dashboard/inactive/promotional-offers.svg",
    childDropdown: [
      {
        text: "Promotional",
        link: "/admin/promotional-offers/promotional",
        module: "Promotional Offers",
      },
      {
        text: "Referrals",
        link: "/admin/promotional-offers/referrals",
        module: "Promotional Offers",
      },
    ],
  },
  {
    id: 7,
    text: "Support & Feedback",
    link: "/admin/support",
    module: "Support & Feedback",
    isDropDown: false,
    activeImage: "/dashboard/active/support.svg",
    inActiveImage: "/dashboard/inactive/support.svg",
  },
];

/**
 * Settings doesn't require specific module permission
 * as it's a personal account setting
 */