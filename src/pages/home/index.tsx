import { Heading, Text } from "@aim-ignite-ui/react";
import Image from "next/image";
import { Container, Hero, Preview } from "./styles";

import { NextSeo } from "next-seo";
import previewImage from "../../assets/app-preview.png";
import { ClaimUsernameForm } from "./components/ClaimUsernameForm";

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda - Ignite Call"
        description=" Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre"
      />
      <Container>
        <Hero>
          <Heading as="h1" size="4xl">
            Agendamento descomplicado
          </Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamntos
            no seu tempo livre.
          </Text>
          <ClaimUsernameForm />
        </Hero>
        <Preview>
          <Image
            src={previewImage}
            height={400}
            alt="Calendário simbolizando a aplicação em funcionamento"
            quality={100}
            priority
          />
        </Preview>
      </Container>
    </>
  );
}
