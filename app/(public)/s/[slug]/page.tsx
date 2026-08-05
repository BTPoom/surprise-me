import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReceiverView } from "@/components/receiver/receiver-view";

export default async function PublicPage({ params }: { params: { slug: string } }) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
    include: { photos: true },
  });

  if (!page || page.status !== "published") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-transparent">
      <ReceiverView page={page} />
    </div>
  );
}
