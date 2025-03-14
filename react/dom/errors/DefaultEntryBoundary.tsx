"use client";
import { ErrorBoundary } from "react-error-boundary";
import GenericErrorComponent from "@/components/bloc/errors/Error";
import { HasChildren } from "@/lib/definitions/client/interfaces/components";
export default function DefaultEntryBoundary({ children }: HasChildren) {
  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <GenericErrorComponent message='Erro atualizando campo!' />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
