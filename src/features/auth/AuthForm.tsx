import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import type { AuthFormProps } from "#/features/auth/AuthForm.types";

export function AuthForm({
	name,
	title,
	description,
	submitLabel,
	email,
	password,
	error,
	loading,
	onNameChange,
	onEmailChange,
	onPasswordChange,
	onSubmit,
	footer,
}: AuthFormProps) {
	return (
		<main className="flex min-h-svh items-center justify-center px-6 py-12">
			<section className="w-full max-w-sm">
				<div className="mb-8 space-y-2">
					<p className="text-sm font-medium text-muted-foreground">
						MTG Collector
					</p>
					<h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
				<form className="space-y-5" onSubmit={onSubmit}>
					{onNameChange && (
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								required
								value={name}
								onChange={(event) => onNameChange(event.target.value)}
							/>
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							required
							value={email}
							onChange={(event) => onEmailChange(event.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							minLength={8}
							required
							value={password}
							onChange={(event) => onPasswordChange(event.target.value)}
						/>
					</div>
					{error && <p className="text-sm text-destructive">{error}</p>}
					<Button className="w-full" type="submit" disabled={loading}>
						{loading ? "Please wait..." : submitLabel}
					</Button>
				</form>
				<p className="mt-6 text-center text-sm text-muted-foreground">
					{footer}
				</p>
			</section>
		</main>
	);
}
