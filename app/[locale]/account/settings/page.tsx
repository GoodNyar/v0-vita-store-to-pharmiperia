"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useLang } from "@/lib/i18n"
import { createClient } from "@/lib/supabase/client"
import {
  Settings,
  LogOut,
  Loader2,
  Check,
  Mail,
  User as UserIcon,
} from "lucide-react"
import { deleteAccount } from "@/app/actions/account"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Profile {
  first_name?: string
  last_name?: string
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, signOut } = useAuth()
  const { lang, t } = useLang()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [firstName, setFirstName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [authLoading, user, router])

  // Load profile
  useEffect(() => {
    async function loadProfile() {
      if (!user) return

      const supabase = createClient()
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .maybeSingle()

      const profileData: Profile = {
        first_name: data?.first_name ?? undefined,
        last_name: data?.last_name ?? undefined,
      }
      setProfile(profileData)
      setFirstName(profileData.first_name ?? "")
      setProfileLoading(false)
    }

    loadProfile()
  }, [user])

  const handleSaveName = async () => {
    if (!user || !firstName.trim()) return

    setIsSaving(true)
    try {
      const supabase = createClient()
      await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: profile?.last_name || "",
        })
        .eq("id", user.id)

      setProfile({ ...profile, first_name: firstName })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return

    setIsDeleting(true)
    setDeleteError(null)

    try {
      const result = await deleteAccount()
      if (!result.success) {
        setDeleteError(result.error)
        return
      }

      localStorage.removeItem("pharmiperia_favorites")
      localStorage.removeItem("pharmiperia:v2:cart")
      localStorage.removeItem("pharm_consent")
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error deleting account:", error)
      setDeleteError(t("deleteAccountError"))
    } finally {
      setIsDeleting(false)
    }
  }

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            {t("accountSettings")}
          </h1>
        </div>
      </div>

      {/* Profile section */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          {t("profileData")}
        </h2>

        {/* Email - read only */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <Mail className="h-4 w-4" />
            {t("email")}
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-foreground disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t("cannotChangeEmail")}
          </p>
        </div>

        {/* First name */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <UserIcon className="h-4 w-4" />
            {t("firstName")}
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={t("yourName")}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSaveName}
            disabled={isSaving || !firstName.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("saving")}
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t("save")}
              </>
            )}
          </Button>
          {saveSuccess && (
            <span className="text-sm text-green-600 font-medium">
              {t("saved")}
            </span>
          )}
        </div>
      </div>

      {/* Security section */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {t("security")}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {lang === "ru"
            ? "Вы авторизованы в аккаунте. Используйте кнопку ниже для выхода."
            : "Jūs esat autentificēts savā kontā. Izmantojiet zemāk esošo pogu, lai izrakstītos."}
        </p>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("logOutAccount")}
        </Button>
      </div>

      {/* Delete account */}
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          {t("deleteAccountTitle")}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">{t("deleteAccountDesc")}</p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">{t("deleteAccountButton")}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteAccountTitle")}</AlertDialogTitle>
              <AlertDialogDescription>{t("deleteAccountDesc")}</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("deleteAccountConfirmLabel")}
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                autoComplete="off"
              />
            </div>
            {deleteError && (
              <p className="text-sm text-destructive">{deleteError}</p>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteConfirm("")}>
                {lang === "ru" ? "Отмена" : "Atcelt"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  void handleDeleteAccount()
                }}
                disabled={deleteConfirm !== "DELETE" || isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? t("deleteAccountDeleting") : t("deleteAccountButton")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Account info */}
      <div className="rounded-2xl border border-border bg-muted/30 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          {lang === "ru" ? "ID аккаунта" : "Konta ID"}
        </h3>
        <p className="text-xs text-muted-foreground font-mono break-all">
          {user?.id}
        </p>
      </div>
    </div>
  )
}
