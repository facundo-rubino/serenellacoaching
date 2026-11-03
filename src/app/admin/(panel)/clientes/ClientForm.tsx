import { AdminSubmitButton } from "../../AdminActionForm";
import { referralSources, type ClientRow } from "@/lib/admin/types";

type ClientFormProps = {
  client?: ClientRow;
  cities: string[];
  areas: string[];
  people: { id: string; full_name: string }[];
};

export function ClientFields({ client, cities, areas, people }: ClientFormProps) {
  return (
    <>
      {client ? <input type="hidden" name="id" value={client.id} /> : null}
      <label>
        Nombre
        <input name="full_name" defaultValue={client?.full_name} required autoComplete="off" />
      </label>
      <label>
        Teléfono
        <input name="phone" type="tel" inputMode="tel" defaultValue={client?.phone ?? ""} />
      </label>
      <label>
        Ciudad
        <input name="city" list="client-cities" defaultValue={client?.city ?? ""} />
        <datalist id="client-cities">
          {cities.map((city) => <option key={city} value={city} />)}
        </datalist>
      </label>
      <label>
        ¿Cómo te conoció?
        <select name="referral_source" defaultValue={client?.referral_source ?? ""}>
          <option value="">Sin dato</option>
          {referralSources.map((source) => (
            <option key={source.value} value={source.value}>{source.label}</option>
          ))}
        </select>
      </label>
      <details>
        <summary>Más datos</summary>
        <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
          <label>
            Email
            <input name="email" type="email" defaultValue={client?.email ?? ""} />
          </label>
          <label>
            Barrio o zona
            <input name="area" list="client-areas" defaultValue={client?.area ?? ""} />
            <datalist id="client-areas">
              {areas.map((area) => <option key={area} value={area} />)}
            </datalist>
          </label>
          <label>
            Fecha de nacimiento
            <input name="birth_date" type="date" defaultValue={client?.birth_date ?? ""} />
          </label>
          <label>
            ¿Quién lo recomendó?
            <select name="referred_by" defaultValue={client?.referred_by ?? ""}>
              <option value="">Nadie / no sé</option>
              {people.filter((person) => person.id !== client?.id).map((person) => (
                <option key={person.id} value={person.id}>{person.full_name}</option>
              ))}
            </select>
          </label>
          <label>
            Primera visita
            <input name="first_visit_date" type="date" defaultValue={client?.first_visit_date ?? ""} />
          </label>
          <label>
            Notas
            <textarea name="notes" rows={4} defaultValue={client?.notes ?? ""} />
          </label>
        </div>
      </details>
      <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          name="consent"
          type="checkbox"
          defaultChecked={Boolean(client?.consent_at)}
          style={{ width: "auto", minHeight: 0 }}
        />
        El cliente aceptó que guarde sus datos
      </label>
    </>
  );
}

export function ClientSubmit({ label }: { label: string }) {
  return <AdminSubmitButton pendingLabel="Guardando...">{label}</AdminSubmitButton>;
}
