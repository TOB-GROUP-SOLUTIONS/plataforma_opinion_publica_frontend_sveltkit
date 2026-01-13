<script lang="ts">
    import { data } from '$lib/sidebarLinks';
    import { page } from '$app/stores';
    import { sidebarOpen, openSidebar } from '../store';
    import { ChevronDownOutline } from "flowbite-svelte-icons";

    const style = {
        title: `mx-4 text-sm whitespace-pre font-bold text-white`,
        inactive: `text-white`,
        active: `bg-[#DD052B] rounded-lg font-medium text-white`,
        link: `flex items-center justify-start my-2 p-4 w-full rounded-lg hover:bg-[#DD052B] w-fit`,
        close: `lg:duration-700 lg:ease-out lg:invisible lg:opacity-0 lg:transition-all`,
        open: `lg:duration-500 lg:ease-in lg:h-auto lg:opacity-100 lg:transition-all lg:w-auto`,
        subItemLink: `flex items-center gap-3 justify-start my-2 p-3 w-full rounded-lg hover:bg-[#DD052B] pl-10 text-white text-sm`,
        subItemActive: `bg-[#DD052B] rounded-lg font-medium text-white`,
        subItemBullet: `h-1 w-1 rounded-sm bg-white shrink-0`
    };


    let expanded: Record<string, boolean> = {};

    $: if (!$sidebarOpen) {
        expanded = {};
    }

    $: if ($sidebarOpen) {
        data.forEach(item => {
            if (item.sub_items && item.sub_items.some(subItem => subItem.link === $page.url.pathname)) {
                expanded[item.title] = true;
            }
        });
    }
</script>

<ul class="md:p-5">
    {#each data as item (item.title)}
        {#if item.sub_items}
            {@const isActive = item.key && item.key === $page.url.pathname}
            <li>
                <button
                    on:click={() => {
                        const isExpanded = expanded[item.title];
                        expanded = {};
                        if (!isExpanded) {
                            expanded[item.title] = true;
                        }
                        openSidebar();
                    }}
                    class={`${style.link} 
                            ${isActive ? style.active : style.inactive}`}
                >
                    <span class="text-white"><svelte:component this={item.icon} /></span>
                    <span class={`${style.title} ${$sidebarOpen ? style.open : style.close}`}>
                        {item.title}
                    </span>
                    
                    <!-- Badge con contador 
                    {#if itemCount > 0 && $sidebarOpen}
                        <span class={`${style.badge} ${isActive ? 'bg-white text-[#70B19B]' : 'bg-[#70B19B] text-white'}`}>
                            {itemCount}
                        </span>
                    {/if}-->
                    
                    <span
                        class={`ml-auto transition-transform duration-300 text-white`}
                        class:rotate-180={expanded[item.title]}
                    >
                        <ChevronDownOutline size="sm" />
                    </span>
                </button>
                {#if expanded[item.title]}
                    <ul class="pl-4">
                        {#each item.sub_items as subItem (subItem.title)}
                            {@const subItemKey = `${item.title}/${subItem.title}`}
                            <li>
                                <a
                                    href={subItem.link}
                                    class={`${style.subItemLink}
                                    ${subItem.link === $page.url.pathname ? style.subItemActive : ''}`}
                                >
                                    <span class={style.subItemBullet}></span>
                                    {subItem.title}
                                </a>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </li>
        {:else if item.link}
            {@const isActive = item.link === $page.url.pathname}
            <li>
                <a
                    href={item.link}
                    class={`${style.link} 
                            ${isActive ? style.active : style.inactive}`}
                >
                    <span class="text-white"><svelte:component this={item.icon} /></span>
                    <span class={`${style.title} ${$sidebarOpen ? style.open : style.close}`}>
                        {item.title}
                    </span>
                </a>
            </li>
        {/if}
    {/each}
</ul>
