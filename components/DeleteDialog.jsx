"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function DeleteJobDialog({
  jobTitle,
  isDeleting,
  onConfirm,
  triggerClassName = "size-7",
}) {
  const [open, setOpen] = useState(false)

  function handleConfirm() {
    setOpen(false) 
    onConfirm() 
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        disabled={isDeleting}
        aria-label={`Delete ${jobTitle}`}
        title="Delete job post"
        className={`grid shrink-0 place-items-center rounded-lg bg-[#1f1f1f] text-[#a0a0ab] transition-colors hover:bg-red-500/15 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40 ${triggerClassName}`}
      >
        <Trash2 className="size-3.5" aria-hidden />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this Equipment?</AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{jobTitle}&quot; will be permanently deleted. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}