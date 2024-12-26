<script lang="ts">
</script>

<div class="navbar bg-base-100 shadow-xl sticky top-0 z-50">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/>
				</svg>
			</div>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<ul
				tabindex="0"
				class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
			>
				<li><a href="/lab1">Лабораторная 1</a></li>
				<li><a href="/lab2">Лабораторная 2</a></li>
				<li><a href="/lab3">Лабораторная 3</a></li>
				<li><a href="/lab4">Лабораторная 4</a></li>
				<li><a href="/coursework">Курсовая</a></li>
			</ul>
		</div>
		<h1><a class="btn btn-ghost text-xl hidden lg:flex" href="/">ТЯП</a></h1>
	</div>
	<div class="navbar-center ">
		<ul class="menu menu-horizontal px-1 gap-2 hidden lg:flex">
			<li><a href="/lab1">Лабораторная 1</a></li>
			<li><a href="/lab2">Лабораторная 2</a></li>
			<li><a href="/lab3">Лабораторная 3</a></li>
			<li><a href="/lab4">Лабораторная 4</a></li>
			<li><a href="/lab4/su">Лабораторная 4 СУ</a></li>
			<li><a href="/coursework">Курсовая</a></li>
		</ul>
		<h1><a class="btn btn-ghost text-xl lg:hidden flex" href="/">ТЯП</a></h1>
	</div>
	<div class="navbar-end"></div>
</div>
