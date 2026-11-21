"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ImagePlus,
  MapPin,
  PackagePlus,
  Upload,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { createGear } from "@/lib/action";

const fieldClass =
  "h-11 w-full rounded-xl border border-orange-200 bg-white px-4 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-3 focus:ring-orange-100 sm:text-sm";

const selectClass = `${fieldClass} appearance-none pr-10`;

const labelClass = "mb-1.5 block text-sm font-semibold text-gray-900";

const CATEGORIES = ["Agriculture", "Cleaning", "Construction", "Electronics", "Event", "Photography", "Vehicles"];

const rentalTypes = ["Daily", "Weekly", "Monthly"];

const conditions = ["Excellent", "Good", "Fair", "Needs Repair"];

function FieldLabel({ htmlFor, children, required = false }) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
      {required && <span className="ml-1 text-orange-500">*</span>}
    </label>
  );
}

function SelectChevron() {
  return (
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
  );
}

export default function AddEquipmentForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [dragging, setDragging] = useState(false);

  const addFiles = (fileList) => {
    const names = Array.from(fileList ?? []).map((file) => file.name);
    if (names.length === 0) return;
    setPhotos((previous) => [...previous, ...names].slice(0, 6));
  };

  const removePhoto = (index) => {
    setPhotos((previous) => previous.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
const result = await createGear(data)
console.log(result) 
router.push('/dashboard/owner/equipment/');
router.refresh();
    toast.add({
      type: "success",
      title: "Equipment published successfully!",
      description: "Your equipment listing is now live.",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xl shadow-orange-500/5 sm:p-8"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
          <PackagePlus className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            List New Machinery or Gear
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Provide accurate specs, images, and rental rates to get verified and
            rented faster.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {/* Name + Category */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="equipmentName" required>
              Equipment Name
            </FieldLabel>
            <input
              id="equipmentName"
              name="equipmentName"
              type="text"
              required
              placeholder="e.g. Caterpillar Excavator 320D"
              className={fieldClass}
            />
          </div>

          <div>
            <FieldLabel htmlFor="category" required>
              Category
            </FieldLabel>
            <div className="relative">
              <select
                id="category"
                name="category"
                required
                defaultValue={CATEGORIES[0]}
                className={selectClass}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <FieldLabel htmlFor="description" required>
            Description
          </FieldLabel>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Detailed equipment specifications, power, dimensions, operational advice..."
            className="w-full resize-y rounded-xl border border-orange-200 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-3 focus:ring-orange-100 sm:text-sm"
          />
        </div>

        {/* Price + Type + Quantity */}
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <FieldLabel htmlFor="rentalPrice" required>
              Rental Price ($ / day)
            </FieldLabel>
            <input
              id="rentalPrice"
              name="rentalPrice"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="100"
              className={fieldClass}
            />
          </div>

          <div>
            <FieldLabel htmlFor="rentalType" required>
              Rental Type
            </FieldLabel>
            <div className="relative">
              <select
                id="rentalType"
                name="rentalType"
                required
                defaultValue={rentalTypes[0]}
                className={selectClass}
              >
                {rentalTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="quantity" required>
              Available Quantity
            </FieldLabel>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              required
              placeholder="1"
              className={fieldClass}
            />
          </div>
        </div>

        {/* Brand + Model + Condition */}
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <FieldLabel htmlFor="brand">Brand</FieldLabel>
            <input
              id="brand"
              name="brand"
              type="text"
              placeholder="e.g. Caterpillar, Canon"
              className={fieldClass}
            />
          </div>

          <div>
            <FieldLabel htmlFor="model">Model</FieldLabel>
            <input
              id="model"
              name="model"
              type="text"
              placeholder="e.g. CAT 320D"
              className={fieldClass}
            />
          </div>

          <div>
            <FieldLabel htmlFor="condition">Condition</FieldLabel>
            <div className="relative">
              <select
                id="condition"
                name="condition"
                defaultValue={conditions[0]}
                className={selectClass}
              >
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <FieldLabel htmlFor="location" required>
            Location (City, Area)
          </FieldLabel>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
            <input
              id="location"
              name="location"
              type="text"
              required
              placeholder="Dhaka, Bangladesh"
              className={`${fieldClass} pl-10`}
            />
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <ImagePlus className="h-4 w-4 text-orange-500" />
              Equipment &amp; Machinery Images (ImgBB Hosted)
            </p>
            <span className="text-xs font-medium text-gray-400">
              {photos.length}/6 photos
            </span>
          </div>

          <div
            role="button"
            tabIndex={0}
            aria-label="Upload equipment images"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              addFiles(event.dataTransfer.files);
            }}
            className={cn(
              "mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors",
              dragging
                ? "border-orange-400 bg-orange-100/60"
                : "border-orange-200 bg-white/70 hover:border-orange-300 hover:bg-orange-50"
            )}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30">
              <Upload className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-semibold text-gray-900">
              Click to browse or drag and drop images
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Upload photos directly from your device (JPEG, PNG, WEBP, GIF, max
              10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </div>

          {photos.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {photos.map((name, index) => (
                <li
                  key={`${name}-${index}`}
                  className="flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1 text-xs text-gray-600"
                >
                  <span className="max-w-[14rem] truncate">{name}</span>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    aria-label={`Remove ${name}`}
                    className="text-gray-400 transition-colors hover:text-orange-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 border-t border-orange-100 pt-4">
            <label
              htmlFor="imageUrls"
              className="mb-1.5 block text-sm font-semibold text-gray-900"
            >
              Or add additional image URLs manually (one per line)
            </label>
            <textarea
              id="imageUrls"
              name="imageUrls"
              rows={3}
              placeholder="https://..."
              className="w-full resize-y rounded-xl border border-orange-200 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-3 focus:ring-orange-100 sm:text-sm"
            />
          </div>
        </div>

        {/* Terms */}
        <div>
          <FieldLabel htmlFor="rentalTerms">Rental Terms &amp; Conditions</FieldLabel>
          <textarea
            id="rentalTerms"
            name="rentalTerms"
            rows={4}
            placeholder="Operator requirements, fuel policies, deposit instructions..."
            className="w-full resize-y rounded-xl border border-orange-200 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-3 focus:ring-orange-100 sm:text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-orange-100 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-11 w-full rounded-xl border border-orange-200 bg-white px-6 text-sm font-semibold text-gray-700 transition-colors hover:border-orange-300 hover:bg-orange-50 sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 active:translate-y-px sm:w-auto"
        >
          <PackagePlus className="h-4 w-4" />
          Publish Equipment
        </button>
      </div>
    </form>
  );
}
