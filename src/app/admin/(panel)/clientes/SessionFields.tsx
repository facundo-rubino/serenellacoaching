type SessionFieldsProps = {
  clientId?: string;
  clients?: { id: string; full_name: string }[];
  therapies: { id: string; title: string }[];
};

export function SessionFields({ clientId, clients, therapies }: SessionFieldsProps) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      {clientId ? (
        <input type="hidden" name="client_id" value={clientId} />
      ) : (
        <label>
          Cliente
          <select name="client_id" required defaultValue="">
            <option value="" disabled>Elegí un cliente</option>
            {clients?.map((client) => <option key={client.id} value={client.id}>{client.full_name}</option>)}
          </select>
        </label>
      )}
      <label>
        Terapia
        <select name="therapy_id" required defaultValue="">
          <option value="" disabled>Elegí una terapia</option>
          {therapies.map((therapy) => <option key={therapy.id} value={therapy.id}>{therapy.title}</option>)}
        </select>
      </label>
      <label>
        Fecha
        <input name="session_date" type="date" defaultValue={today} required />
      </label>
      <details>
        <summary>Más datos</summary>
        <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
          <label>
            Modalidad
            <select name="modality" defaultValue="presencial">
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
            </select>
          </label>
          <label>
            Monto cobrado
            <input name="amount" type="text" inputMode="decimal" />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input name="paid" type="checkbox" defaultChecked style={{ width: "auto", minHeight: 0 }} />
            Pagó
          </label>
          <label>
            Notas de la sesión
            <textarea name="notes" rows={4} />
          </label>
        </div>
      </details>
    </>
  );
}
