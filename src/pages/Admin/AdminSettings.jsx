import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { adminGetSettings, adminUpdateSettings } from '../../api/endpoints'
import { normalizeUrl } from '../../utils/normalizeUrl'

const inputCls = 'w-full border border-sand rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-accent'
const textAreaCls = `${inputCls} resize-none`
const shopNamePattern = /^[A-Za-z0-9\s&'.-]+$/
const taglinePattern = /^[A-Za-z0-9\s,&'.!-]*$/
const phonePattern = /^\+?[\d\s()-]+$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const addressPattern = /^[A-Za-z0-9\s,.'\-/#()]+$/

const restrictPhoneInput = (event) => {
  const filteredValue = event.target.value.replace(/(?!^\+)[^\d\s()-]/g, '')
  let digitCount = 0
  const limitedValue = filteredValue
    .split('')
    .filter((char, index) => {
      if (/\d/.test(char)) {
        digitCount += 1
        return digitCount <= 15
      }

      if (char === '+') {
        return index === 0
      }

      return /[\s()-]/.test(char)
    })
    .join('')

  if (limitedValue !== event.target.value) {
    event.target.value = limitedValue
  }
}

const validatePhoneNumber = (value) => {
  const trimmedValue = value?.trim()

  if (!trimmedValue) return true
  if (/[A-Za-z]/.test(trimmedValue)) return 'Phone number cannot contain letters'
  if (!phonePattern.test(trimmedValue)) return 'Enter a valid phone number'

  const digits = trimmedValue.replace(/\D/g, '')
  const isSriLankanLocal = /^0\d{9}$/.test(digits)
  const isSriLankanIntl = /^94\d{9}$/.test(digits)

  if (digits.length > 15) {
    return 'Phone number must be 15 digits or fewer'
  }

  if (digits.startsWith('0') || digits.startsWith('94')) {
    return (isSriLankanLocal || isSriLankanIntl) || 'Sri Lankan phone numbers must be 10 digits, or 11 digits starting with 94'
  }

  return (digits.length >= 8 && digits.length <= 15) || 'International phone numbers must be 8 to 15 digits'
}

const validateOptionalUrl = (value) => {
  const trimmedValue = value?.trim()
  if (!trimmedValue) return true

  try {
    const url = new URL(normalizeUrl(trimmedValue))
    return ['http:', 'https:'].includes(url.protocol) || 'Enter a valid URL'
  } catch {
    return 'Enter a valid URL'
  }
}

const preventNumberScroll = (event) => {
  event.currentTarget.blur()
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-body mb-1">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-500">{error.message}</p> : null}
    </div>
  )
}

export default function AdminSettings() {
  const qc = useQueryClient()
  const { data: settings, isLoading } = useQuery({ queryKey: ['admin-settings'], queryFn: adminGetSettings })
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => { if (settings) reset(settings) }, [settings, reset])

  const updateMut = useMutation({
    mutationFn: adminUpdateSettings,
    onSuccess: (updatedSettings) => {
      toast.success('Settings saved')
      qc.setQueryData(['admin-settings'], updatedSettings)
      qc.setQueryData(['settings'], updatedSettings)
      qc.invalidateQueries({ queryKey: ['admin-settings'] })
      qc.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: () => toast.error('Failed to save settings'),
  })

  const normalizeSettingsPayload = (data) => ({
    ...data,
    instagram_url: normalizeUrl(data.instagram_url),
    facebook_url: normalizeUrl(data.facebook_url),
    tiktok_url: normalizeUrl(data.tiktok_url),
  })

  if (isLoading) return <p className="text-muted font-body">Loading...</p>

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-3xl text-text mb-8">Site Settings</h1>
      <form onSubmit={handleSubmit((d) => updateMut.mutate(normalizeSettingsPayload(d)))} className="space-y-5 bg-white rounded-xl p-6 border border-sand">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Shop Name" error={errors.shop_name}>
            <input
              className={inputCls}
              {...register('shop_name', {
                required: 'Shop name is required',
                validate: (value) => value.trim().length > 0 || 'Shop name is required',
                pattern: { value: shopNamePattern, message: 'Use letters, numbers, spaces, and basic punctuation only' },
                maxLength: { value: 200, message: 'Shop name must be 200 characters or fewer' },
              })}
            />
          </Field>
          <Field label="Tagline" error={errors.tagline}>
            <input
              className={inputCls}
              {...register('tagline', {
                pattern: { value: taglinePattern, message: 'Use plain text and basic punctuation only' },
                maxLength: { value: 300, message: 'Tagline must be 300 characters or fewer' },
              })}
            />
          </Field>
          <Field label="Captured Moments Count" error={errors.captured_moments_count}>
            <input
              type="number"
              min="1"
              className={inputCls}
              onWheel={preventNumberScroll}
              {...register('captured_moments_count', {
                valueAsNumber: true,
                min: { value: 1, message: 'Captured moments count must be greater than 0' },
              })}
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              className={inputCls}
              {...register('email', {
                validate: (value) => !value?.trim() || emailPattern.test(value.trim()) || 'Enter a valid email address',
              })}
            />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input
              className={inputCls}
              onInput={restrictPhoneInput}
              {...register('phone', { validate: validatePhoneNumber })}
            />
          </Field>
          <Field label="Second Phone" error={errors.phone_secondary}>
            <input
              className={inputCls}
              onInput={restrictPhoneInput}
              {...register('phone_secondary', { validate: validatePhoneNumber })}
            />
          </Field>
          <Field label="Instagram URL" error={errors.instagram_url}>
            <input className={inputCls} {...register('instagram_url', { validate: validateOptionalUrl })} />
          </Field>
          <Field label="Facebook URL" error={errors.facebook_url}>
            <input className={inputCls} {...register('facebook_url', { validate: validateOptionalUrl })} />
          </Field>
          <Field label="TikTok URL" error={errors.tiktok_url}>
            <input className={inputCls} {...register('tiktok_url', { validate: validateOptionalUrl })} />
          </Field>
        </div>
        <Field label="Address" error={errors.address}>
          <textarea
            rows={2}
            className={textAreaCls}
            {...register('address', {
              pattern: { value: addressPattern, message: 'Use letters, numbers, and address punctuation only' },
              maxLength: { value: 500, message: 'Address must be 500 characters or fewer' },
            })}
          />
        </Field>
        <Field label="Footer Text" error={errors.footer_text}>
          <textarea
            rows={2}
            className={textAreaCls}
            {...register('footer_text', {
              maxLength: { value: 500, message: 'Footer text must be 500 characters or fewer' },
            })}
          />
        </Field>
        <button type="submit" disabled={updateMut.isPending}
          className="bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-body hover:bg-accent/90 disabled:opacity-60">
          {updateMut.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
