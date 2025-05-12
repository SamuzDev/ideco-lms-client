import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'

import { ResetPasswordSchema } from '@/helpers/zod/reset-password-schema'
import { resetPassword } from '@/lib/auth-client'
import { useAuthState } from '@/hooks/useAuthState'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Button } from './ui/button'
import { Input } from './ui/input'
import FormError from './FormError'
import { FormSuccess } from './FormSuccess'
import CardWrapper from './CardWrapper'

const ResetPassword = () => {
  const navigate = useNavigate()
  const { error, success, loading, setError, setLoading, setSuccess, resetState } = useAuthState()

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    try {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
        setError("Token de restablecimiento no encontrado en la URL.");
        return;
    }

      await resetPassword(
        { newPassword: values.password, token },
        {
          onRequest: () => {
            resetState()
            setLoading(true)
          },
          onResponse: () => {
            setLoading(false)
          },
          onSuccess: () => {
            setSuccess('New password has been created')
            navigate('/signin')
          },
          onError: (ctx) => {
            setError(ctx.error.message)
          },
        }
      )
    } catch (error) {
      console.error(error)
      setError('Something went wrong')
    }
  }

  return (
    <CardWrapper
      cardTitle="Reset Password"
      cardDescription="Create a new password"
      cardFooterLink="/signin"
      cardFooterDescription="Remember your password?"
      cardFooterLinkTitle="Signin"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input disabled={loading} type="password" placeholder="************" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input disabled={loading} type="password" placeholder="*************" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={loading}>
            Submit
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default ResetPassword
