import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Download, Mail, Save, RotateCcw, Send } from "lucide-react";

type Subscriber = {
  id: string;
  email: string;
  confirmed: boolean;
  subscribed_at: string;
};

const DRAFT_KEY = "newsletter_draft";

interface Draft {
  subject: string;
  body: string;
}

function exportCsv(subscribers: Subscriber[]) {
  const rows = [
    ["email", "confirmed", "subscribed_at"],
    ...subscribers.map((s) => [s.email, String(s.confirmed), s.subscribed_at]),
  ];
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "subscribers.csv";
  a.click();
  URL.revokeObjectURL(url);
}

interface AdminNewsletterProps {
  showSubscribersTab?: boolean;
}

export default function AdminNewsletter({ showSubscribersTab = false }: AdminNewsletterProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadSubscribers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadSubscribers() {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });
      if (error) throw error;
      setSubscribers(data as Subscriber[]);
    } catch (err: unknown) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function saveDraft() {
    const draft: Draft = { subject, body };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    toast({ title: "Draft saved" });
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) { toast({ title: "No saved draft found" }); return; }
      const draft = JSON.parse(raw) as Draft;
      setSubject(draft.subject ?? "");
      setBody(draft.body ?? "");
      toast({ title: "Draft loaded" });
    } catch {
      toast({ title: "Could not load draft", variant: "destructive" });
    }
  }

  function sendTest() {
    toast({ title: "Test email sent", description: "Test sent to royokola3@gmail.com (stub - no real API call)." });
  }

  const confirmed = subscribers.filter((s) => s.confirmed).length;

  const CompositionPanel = () => (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            Subscribers
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => exportCsv(subscribers)} disabled={loading}>
            <Download className="h-3 w-3" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-6 w-40" />
          ) : (
            <p className="text-2xl font-bold">
              {subscribers.length}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({confirmed} confirmed)
              </span>
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-sm">Compose Draft</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Newsletter subject..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Body (Markdown-style)</label>
            <Textarea
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your newsletter here..."
              className="font-mono text-xs"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="gap-2" onClick={saveDraft}>
              <Save className="h-3 w-3" />
              Save Draft
            </Button>
            <Button size="sm" variant="outline" className="gap-2" onClick={loadDraft}>
              <RotateCcw className="h-3 w-3" />
              Load Draft
            </Button>
            <Button size="sm" variant="outline" className="gap-2" onClick={sendTest}>
              <Send className="h-3 w-3" />
              Send Test
            </Button>
          </div>

          {body.trim() && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Preview</p>
              <div className="bg-muted/30 rounded-lg p-4 text-sm whitespace-pre-wrap text-justify leading-relaxed border border-border">
                {body}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const SubscriberList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{subscribers.length} subscribers</p>
        <Button size="sm" variant="outline" className="gap-2" onClick={() => exportCsv(subscribers)}>
          <Download className="h-3 w-3" />
          Export CSV
        </Button>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Confirmed</TableHead>
              <TableHead className="hidden sm:table-cell">Subscribed At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={3}><Skeleton className="h-6 w-full" /></TableCell>
                </TableRow>
              ))
            ) : subscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">No subscribers yet.</TableCell>
              </TableRow>
            ) : (
              subscribers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs truncate max-w-[200px]">{s.email}</TableCell>
                  <TableCell>
                    {s.confirmed ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">confirmed</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                    {new Date(s.subscribed_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (showSubscribersTab) {
    return (
      <Tabs defaultValue="subscribers">
        <TabsList className="mb-4">
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
        </TabsList>
        <TabsContent value="subscribers"><SubscriberList /></TabsContent>
        <TabsContent value="compose"><CompositionPanel /></TabsContent>
      </Tabs>
    );
  }

  return (
    <Tabs defaultValue="compose">
      <TabsList className="mb-4">
        <TabsTrigger value="compose">Compose</TabsTrigger>
        <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
      </TabsList>
      <TabsContent value="compose"><CompositionPanel /></TabsContent>
      <TabsContent value="subscribers"><SubscriberList /></TabsContent>
    </Tabs>
  );
}
