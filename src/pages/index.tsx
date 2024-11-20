import { EventCard } from "@/entities/event";
import { JoinEventButton } from "@/features/join-event";
import { LeaveEventButton } from "@/features/leave-event";
import { trpc } from "@/shared/api";
import { Layout } from "@/shared/components/Layout";
import { ReactNode } from "react";

export default function Home() {
  const { data, refetch } = trpc.event.findMany.useQuery();

  return (
    <ul>
      {data?.map((event) => (
        <li key={event.id} className="mb-6">
          <EventCard
            {...event}
            action={
              !event.isJoined ? (
                <JoinEventButton eventId={event.id} onSuccess={refetch} />
              ) : (
                <LeaveEventButton eventId={event.id} onSuccess={refetch} />
              )
            }
          />
        </li>
      ))}
    </ul>
  );
}

Home.getLayout = (page: ReactNode) => {
  return <Layout>{page}</Layout>;
}
