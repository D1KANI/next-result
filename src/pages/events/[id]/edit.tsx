import { CreateEventForm } from "@/features/create-event";
import { CreateEventSchema, trpc } from "@/shared/api";
import { Layout } from "@/shared/components/Layout";
import { useRouter } from "next/router";

export default function EditEventPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: event, isLoading } = trpc.event.findUnique.useQuery({ id: Number(id) });
  const { mutate } = trpc.event.edit.useMutation({
    onSuccess: (data) => {
      router.push(`/events/${data.id}`);
    },
  });

  const handleSubmit = (data: CreateEventSchema) => {
    if (!event) return;
    mutate({ ...data, id: Number(id) });
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (!event) return <div>Событие не найдено</div>;

  return (
    <CreateEventForm
      onSubmit={handleSubmit}
      initialData={{
        title: event.title,
        description: event.description || undefined,
        date: event.date,
      }}
      buttonText="Изменить"
    />
  );
}

EditEventPage.getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>;
