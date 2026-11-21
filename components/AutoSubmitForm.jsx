"use client";

import { useRef } from "react";

export default function AutoSubmitForm({ children, className }) {
  const formRef = useRef(null);
  const timer = useRef(null);

  const handleChange = (e) => {
    const isTyping = e.target.type === "text" || e.target.type === "number";
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => formRef.current?.requestSubmit(),
      isTyping ? 600 : 0
    );
  };

  return (
    <form
      ref={formRef}
      method="GET"
      onChange={handleChange}
      className={className}
    >
      {children}
    </form>
  );
}