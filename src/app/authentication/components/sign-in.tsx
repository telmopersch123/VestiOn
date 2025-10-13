"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

import { GoogleIcon } from "./googleIcon";

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  email: z.email({
    message: "Por favor, insira um endereço de email válido.",
  }),
  password: z
    .string("Por favor, insira sua senha.")
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(32, "A senha deve ter no máximo 32 caracteres."),
});

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState([false, false]);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading((prev) => [true, prev[1]]);
    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
          onError: (error) => {
            if (error.error.code === "USER_NOT_FOUND") {
              toast.error("Email não encontrado.");
              return form.setError("email", {
                message: "Email não encontrado.",
              });
            }
            if (error.error.code === "INVALID_EMAIL_OR_PASSWORD") {
              toast.error("Email ou senha inválidos.");
              form.setError("password", {
                message: "Email ou senha inválidos.",
              });
              return form.setError("email", {
                message: "Email ou senha inválidos.",
              });
            }
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleSignInWithGoogle = async () => {
    setIsLoading((prev) => [prev[0], true]);
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Faça login para continuar.</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o seu email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Digite a sua senha"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                disabled={isLoading[0]}
                type="submit"
                className="w-full cursor-pointer"
              >
                {isLoading[0] && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Entrar
              </Button>
              <Button
                disabled={isLoading[1]}
                onClick={handleSignInWithGoogle}
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
              >
                {isLoading[1] && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <GoogleIcon />
                Entrar com Google
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default SignInForm;
