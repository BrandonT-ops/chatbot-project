declare global {
  interface Window {
    google: typeof google; // Déclare que window.google existe
  }
}

declare namespace google.accounts.id {
  interface CredentialResponse {
    credential: string;
    select_by: string;
  }

  function initialize(config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
  }): void;

  function renderButton(
    parent: HTMLElement,
    options: {
      theme?: string;
      size?: string;
      text?: string;
      shape?: string;
    }
  ): void;

  function prompt(): void;
}