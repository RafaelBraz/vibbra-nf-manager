import type { FormEvent } from "react";
import { useState } from "react";
import axios from "axios";

interface ICreateUserFormProps {
  onSubmit: () => void;
}

export function CreateUserForm({ onSubmit }: ICreateUserFormProps) {
  const emptyUser = {
    email: "",
    name: "",
    cnpj: "",
    companyName: "",
    password: "",
    phone: "",
  };

  const [user, setUser] = useState(emptyUser);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmation: false,
  });
  const [loading, setLoading] = useState(false);

  function handleUserChange(name: string, value: string) {
    setUser((user) => ({
      ...user,
      [name]: value,
    }));
  }

  function handlePasswordVisibilityChange(name: string, value: boolean) {
    setPasswordVisibility((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    try {
      event.preventDefault();

      if (user.password !== passwordConfirmation) {
        alert("Senha e confirmação não coincidem.");
      }

      setLoading(true);

      const res = await axios("/api/user", {
        method: "POST",
        data: {
          ...user,
        },
      });

      if (res.status === 500) {
        throw new Error("Erro na criação do usuário");
      }

      onSubmit();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <form
      className="p-4 flex flex-col gap-4 bg-zinc-300 rounded-md"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col">
        E-mail:
        <input
          name="email"
          type="email"
          value={user.email}
          onChange={(e) => handleUserChange("email", e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col">
        Nome:
        <input
          name="name"
          type="text"
          value={user.name}
          onChange={(e) => handleUserChange("name", e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col">
        CNPJ:
        <input
          name="cnpj"
          type="text"
          value={user.cnpj}
          onChange={(e) => handleUserChange("cnpj", e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col">
        Nome da empresa:
        <input
          autoComplete="organization"
          name="companyName"
          type="text"
          value={user.companyName}
          onChange={(e) => handleUserChange("companyName", e.target.value)}
          required
        />
      </label>

      <div className="flex gap-2 items-end">
        {passwordVisibility.password ? (
          <>
            <label className="flex flex-col">
              Senha:
              <input
                autoComplete="new-password"
                name="password"
                type="text"
                value={user.password}
                onChange={(e) => handleUserChange("password", e.target.value)}
                required
              />
            </label>
            <button
              className="p-2 bg-zinc-400 text-zinc-50 rounded-md"
              type={"button"}
              onClick={() =>
                handlePasswordVisibilityChange(
                  "password",
                  !!!passwordVisibility.password
                )
              }
            >
              Esconder
            </button>
          </>
        ) : (
          <>
            <label className="flex flex-col">
              Senha:
              <input
                autoComplete="new-password"
                name="password"
                type="password"
                value={user.password}
                onChange={(e) => handleUserChange("password", e.target.value)}
                required
              />
            </label>
            <button
              className="p-2 bg-zinc-400 text-zinc-50 rounded-md"
              type={"button"}
              onClick={() =>
                handlePasswordVisibilityChange(
                  "password",
                  !!!passwordVisibility.password
                )
              }
            >
              Ver
            </button>
          </>
        )}
      </div>

      <div className="flex gap-2 flex gap-2 items-end">
        {passwordVisibility.confirmation ? (
          <>
            <label className="flex flex-col">
              Confirmar senha:
              <input
                autoComplete="new-password"
                name="password-confirmation"
                type="text"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </label>
            <button
              className="p-2 bg-zinc-400 text-zinc-50 rounded-md"
              type={"button"}
              onClick={() =>
                handlePasswordVisibilityChange(
                  "confirmation",
                  !!!passwordVisibility.confirmation
                )
              }
            >
              Esconder
            </button>
          </>
        ) : (
          <>
            <label className="flex flex-col">
              Confirmar senha:
              <input
                autoComplete="new-password"
                name="password-confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </label>
            <button
              className="p-2 bg-zinc-400 text-zinc-50 rounded-md"
              type={"button"}
              onClick={() =>
                handlePasswordVisibilityChange(
                  "confirmation",
                  !!!passwordVisibility.confirmation
                )
              }
            >
              Ver
            </button>
          </>
        )}
      </div>

      <label className="flex flex-col">
        Telefone:
        <input
          autoComplete="tel"
          name="phone"
          type="tel"
          value={user.phone}
          onChange={(e) => handleUserChange("phone", e.target.value)}
          required
        />
      </label>

      <button
        type={"submit"}
        className="py-2 px-4 bg-zinc-500 text-zinc-50 rounded-md hover:bg-zinc-400"
      >
        Criar usuário
      </button>
    </form>
  );
}
