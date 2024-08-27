import { ProfileForm } from '@/src/shared/components'
import { getUserSession } from '@/src/shared/lib/get-user-session'
import { redirect } from 'next/navigation'
import { prisma } from '../../../../prisma/prisma-client'

export default async function ProfilePage() {
	const session = await getUserSession()

	if (!session) {
		return redirect('/not-auth')
	}

	const user = await prisma.user.findFirst({
		where: { id: Number(session?.id) },
	})

	if (!user) {
		return redirect('/not-auth')
	}

	return <ProfileForm data={user} />
}
