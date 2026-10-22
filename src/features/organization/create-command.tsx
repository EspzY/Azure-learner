'use client';

import { useState } from 'react';
import { ArrowDown, ArrowRight, FolderPlus, Globe2 } from 'lucide-react';
import { nb, regionLabels } from '@/content/nb';
import { regions } from '@/domain/simulation';

export function CreateCommand({
  subscription,
  error,
  ready,
  onCreate,
  onEdit,
}: {
  subscription: string;
  error: string;
  ready: boolean;
  onCreate: (name: string, region: string) => void;
  onEdit: () => void;
}) {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('westeurope');
  return (
    <form
      className="create-command"
      onSubmit={(event) => {
        event.preventDefault();
        onCreate(name, region);
      }}
    >
      <p className="eyebrow">{nb.universe.commandEyebrow}</p>
      <div className="command-parent">
        <span>{nb.universe.commandScope}</span>
        <strong>{subscription}</strong>
        <ArrowDown size={16} />
      </div>
      <div className="command-object-preview">
        <FolderPlus size={30} />
        <span>{name || nb.universe.create}</span>
      </div>
      <div className="form-field">
        <label htmlFor="group-name">{nb.mission.name}</label>
        <input
          id="group-name"
          required
          maxLength={90}
          value={name}
          autoComplete="off"
          placeholder="rg-…"
          onChange={(event) => {
            setName(event.target.value);
            onEdit();
          }}
          aria-invalid={!!error}
          aria-describedby={`name-help${error ? ' creation-error' : ''}`}
        />
        <small id="name-help">{nb.mission.nameHelp}</small>
      </div>
      <div className="form-field">
        <label htmlFor="group-region">{nb.mission.region}</label>
        <select
          id="group-region"
          value={region}
          onChange={(event) => {
            setRegion(event.target.value);
            onEdit();
          }}
        >
          {regions.map((id) => (
            <option value={id} key={id}>
              {regionLabels[id]}
            </option>
          ))}
        </select>
      </div>
      <p className="command-location-note">
        <Globe2 size={15} />
        {nb.universe.commandNote}
      </p>
      {error && (
        <p role="alert" id="creation-error" className="form-error">
          {error}
        </p>
      )}
      <button className="button button-primary command-submit" type="submit" disabled={!ready}>
        {nb.mission.submit}
        <ArrowRight size={17} />
      </button>
      <p className="form-disclaimer">{nb.mission.simulationNote}</p>
    </form>
  );
}
