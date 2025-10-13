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
type FormValues = z.infer<typeof formSchema>;

const formSchema = z
  .object({
    name: z
      .string("Por favor, insira o seu nome.")
      .trim()
      .min(2, "O nome deve ter no mínimo 2 caracteres")
      .max(50, "O nome deve ter no máximo 50 caracteres."),
    email: z.email({
      message: "Por favor, insira um endereço de email válido.",
    }),
    password: z
      .string("Por favor, insira sua senha.")
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .max(32, "A senha deve ter no máximo 32 caracteres."),
    "password-repeat": z
      .string("Por favor, insira sua senha novamente.")
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .max(32, "A senha deve ter no máximo 32 caracteres."),
  })
  .refine(
    (data) => {
      return data.password === data["password-repeat"];
    },
    {
      error: "As senhas não coincidem.",
      path: ["password-repeat"],
    },
  );

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
          onError: (error) => {
            if (error.error.code === "USER_ALREADY_EXISTS") {
              toast.error("Email ou senha inválidos.");
              return form.setError("email", {
                type: "manual",
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
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Criar Conta</CardTitle>
          <CardDescription>Criar uma nova conta.</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o seu Nome" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="password-repeat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Digite sua senha novamente</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Digite a sua senha novamente"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                disabled={isLoading}
                className="w-full cursor-pointer"
                type="submit"
              >
                {" "}
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar conta
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};
export default SignUpForm;
