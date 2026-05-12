"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useMessages } from "@/hooks/useSupabase";
import { Mail, MailOpen, Trash2, RefreshCw } from "lucide-react";

export default function MessagesPage() {
  const { data: messages, loading, error, refetch, markAsRead, remove } = useMessages();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await remove(id);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Messages</h2>
          <p className="text-muted">
            {messages.length} message{messages.length !== 1 ? "s" : ""} — {unreadCount} non lu{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="secondary" size="icon" onClick={refetch} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && <div className="text-red-400">Erreur : {error}</div>}
      {loading && <div className="text-muted">Chargement...</div>}

      <div className="space-y-3">
        {messages.length === 0 && !loading && (
          <Card>
            <CardContent className="py-8 text-center text-muted">
              Aucun message pour le moment.
            </CardContent>
          </Card>
        )}

        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={`transition-all ${!msg.read ? "border-l-4 border-l-primary" : ""}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {msg.read ? (
                    <MailOpen className="h-5 w-5 text-muted" />
                  ) : (
                    <Mail className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <CardTitle className="text-base">{msg.name}</CardTitle>
                    <p className="text-sm text-muted">{msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!msg.read && (
                    <Button size="sm" variant="ghost" onClick={() => markAsRead(msg.id)}>
                      Marquer lu
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(msg.id)}
                    disabled={deleting === msg.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{msg.subject || "Sans sujet"}</Badge>
                <span className="text-xs text-muted">
                  {new Date(msg.created_at).toLocaleString("fr-FR")}
                </span>
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
