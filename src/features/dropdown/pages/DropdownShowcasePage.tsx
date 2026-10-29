// pages/DropdownShowcasePage.tsx

import { useState } from "react";

import {
  Dropdown,
  type DropdownItem,
} from "./../components/Dropdown";

interface Country extends DropdownItem {
  code: string;
}

const countries: Country[] = [
  {
    label: "India",
    value: "india",
    code: "🇮🇳",
  },
  {
    label: "United States",
    value: "usa",
    code: "🇺🇸",
  },
  {
    label: "Japan",
    value: "japan",
    code: "🇯🇵",
  },
  {
    label: "Germany",
    value: "germany",
    code: "🇩🇪",
  },
];

export default function DropdownShowcasePage() {
  const [country, setCountry] =
    useState<Country | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-xl mx-auto">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
            Reusable Component
          </p>

          <h1 className="text-4xl font-bold">
            Accessible Dropdown
          </h1>

          <p className="text-slate-400 mt-3">
            Fully keyboard accessible reusable
            dropdown component with portal support,
            focus management, outside click handling,
            and custom rendering APIs.
          </p>
        </div>

        {/* Default Dropdown */}
        <div className="mb-8">
          <p className="text-sm mb-3 text-slate-400">
            Default Dropdown
          </p>

          <Dropdown
            items={countries}
            value={country}
            onChange={setCountry}
          />
        </div>

        {/* Custom Render Dropdown */}
        <div>
          <p className="text-sm mb-3 text-slate-400">
            Custom Render Dropdown
          </p>

          <Dropdown
            items={countries}
            value={country}
            onChange={setCountry}
            dropdownClassName="text-amber-200"
            renderTrigger={({
              selectedItem,
              isOpen,
            }) => (
              <button
                className="
                  h-14 w-full
                  rounded-2xl
                  bg-slate-900
                  border border-slate-700
                  px-5
                  flex items-center justify-between
                "
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {selectedItem?.code ??
                      "🌍"}
                  </span>

                  <span>
                    {selectedItem?.label ??
                      "Select Country"}
                  </span>
                </div>

                <span
                  className={`
                    transition-transform
                    ${
                      isOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                >
                  ▼
                </span>
              </button>
            )}
            renderItem={({
              item,
              isFocused,
            }) => (
              <div
                className="
                  flex items-center gap-3
                "
              >
                <span className="text-xl">
                  {item.code}
                </span>

                <span
                  className={
                    isFocused
                      ? "font-medium"
                      : ""
                  }
                >
                  {item.label}
                </span>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}