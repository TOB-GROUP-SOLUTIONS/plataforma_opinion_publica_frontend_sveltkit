<script lang="ts">
	import Cards from './Cards.svelte';
	import DataTable2 from './DataTable2.svelte';

	export let user: any = undefined;
	export let handleFiles: undefined | ((e: any) => void) = undefined;
	export let handleView: undefined | ((e: any) => void) = undefined;
	export let handleAssign: undefined | ((e: any) => void) = undefined;
	export let handleChangeStatus: undefined | ((e: any) => void) = undefined;
	export let handleRedirect: undefined | ((e: any) => void) = undefined;
	export let handleAddBudget: undefined | ((e: any) => void) = undefined;
	export let handleConfirmPayment: undefined | ((e: any) => void) = undefined;
	export let handleViewForm: undefined | ((e: any) => void) = undefined;
	export let handleViewProof: undefined | ((e: any) => void) = undefined;
	export let handleDownload: undefined | ((e: any) => void) = undefined;
	export let handleGoToLead: undefined | ((e: any) => void) = undefined;
	export let handleNote: undefined | ((e: any) => void) = undefined;
	export let handleNotePayment: undefined | ((e: any) => void) = undefined;



	export let handleDelete: (e: any) => void;
	export let handleEdit: (e: any) => void;
	export let columns: any[] = [];
	export let data: any;
	export let render: (key: string, obj: any) => any;
	export let actions: any = [];
	export let defaultActions: string[] = ['edit', 'delete'];
	export let orderCols: string[] = [];
	export let statusFilter: string | null = null;
	export let handleGoToArea: undefined | ((e: any) => void) = undefined;
	export let highlightedLeadId: number | null = null;
</script>

<div class="md:hidden block">
	<Cards
		{user}
		{columns}
		{data}
		{render}
		{defaultActions}
		{actions}
		on:goToArea={handleGoToArea}
		on:files={handleFiles}
		on:ver-historial={handleRedirect}
		on:delete={handleDelete}
		on:edit={handleEdit}
	/>
</div>

<div class="md:block hidden">
	<DataTable2
		{user}
		{orderCols}
		{columns}
		{data}
		{render}
		{actions}
		{defaultActions}
		{statusFilter}
		{highlightedLeadId}
		on:confirmPayment={handleConfirmPayment}
		on:goToArea={handleGoToArea}
		on:view={handleView}
		on:notes={handleNote}
		on:notesPayment={handleNotePayment}
		on:change_status={handleChangeStatus}
		on:sendMoreInfoForm={handleViewForm}
		on:view_proof={handleViewProof}
		on:asingToUser={handleAssign}
		on:add_budget={handleAddBudget}
		on:files={handleFiles}
		on:ver-historial={handleRedirect}
		on:delete={handleDelete}
		on:download={handleDownload}
		on:goToLead={handleGoToLead}
		on:edit={handleEdit}
		on:generate_form
	/>
</div>
