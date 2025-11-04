import React, { Suspense } from "react";
import ResetPasswordPage from "./ResetPasswordClient";

const ResetPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default ResetPassword;
