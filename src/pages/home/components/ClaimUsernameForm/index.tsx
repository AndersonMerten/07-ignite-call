import { Button, Text, TextInput } from "@aim-ignite-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, Formannotation } from "./styles";

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "O usuário precisa ter pelo menos 3 letras." })
    .regex(/^([a-z\\\\-]+)$/i, { message: "Use apenas letras e hifens." })
    .transform((username) => username.toLowerCase()),
});

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  });

  const router = useRouter();

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data;

    await router.push(`/register?username=${username}`);
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register("username")}
        />
        <Button size="md" type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
        <Formannotation></Formannotation>
      </Form>
      <Text size="sm">
        {errors.username
          ? errors.username.message
          : "Digite o nome do usuário."}
      </Text>
    </>
  );
}
