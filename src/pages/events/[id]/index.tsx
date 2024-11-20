import { EventDetail } from "@/entities/event";
import { trpc } from "@/shared/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { EditEventButton } from "@/features/edit-event";
import { Layout } from "@/shared/components/Layout";

export default function Event() {
  const router = useRouter();
  const session = useSession();

  const { data, isLoading } = trpc.event.findUnique.useQuery({
    id: Number(router.query.id),
  });

  const isAuthor = session.data?.user?.id === data?.authorId;

  if (isLoading) {
    return "Loading...";
  }

  if (session.status === "unauthenticated") {
    return "Forbidden";
  }

  if (!data) {
    return "No data";
  }

  return <EventDetail {...data} action={isAuthor ? <EditEventButton id={Number(router.query.id)} /> : null} />;
}

Event.getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>;
