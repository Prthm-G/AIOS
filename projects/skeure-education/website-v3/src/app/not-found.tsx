import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

// App-router 404. Renders inside the root layout, so header/footer/FAB are present.
export default function NotFound() {
  return (
    <div className="pb-24 sm:pb-32">
      <PageHero
        eyebrow="Error 404"
        title="page not found"
        motif="notfound"
        align="center"
        intro="The page you're looking for doesn't exist or has moved. If you were expecting to find something specific, just ask us on WhatsApp and we'll point you the right way."
        actions={
          <>
            <Button href="/" variant="secondary">
              Go home
            </Button>
            <WhatsAppButton label="Ask on WhatsApp" />
          </>
        }
      />
    </div>
  );
}
