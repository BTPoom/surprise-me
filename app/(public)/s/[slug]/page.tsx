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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">
      <ReceiverView page={page} />
    </div>
  );
}
