import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { useApplicationStore } from "../stores/application.store";
import { useRoleStore } from "../stores/roles.store";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "../services/applicationService";
import { maintainAppsSchema } from "../schemas/maintain_apps";

// Default form values (moved from MaintainApps.tsx)
const defaultFormValues: z.input<typeof maintainAppsSchema> = {
	appId: "",
	appName: "",
	appDescription: "",
	deleteInactiveUsers: false,
	retentionDays: undefined,
	roles: [],
};

export function useAppManagement() {
	const queryClient = useQueryClient();
	const {
		selectedApplicationRowData,
		setSelectedApplicationRowData,
		allApplications,
		setAllApplications,
	} = useApplicationStore();
	const { allRoles, setSelectedRoleRowData, setAllRoles } = useRoleStore();

	const appForm = useForm<z.input<typeof maintainAppsSchema>>({
		resolver: zodResolver(maintainAppsSchema),
		defaultValues: defaultFormValues,
	});
	const { reset, control, trigger, getValues, formState } = appForm;
	const { append, remove, replace } = useFieldArray({
		control,
		name: "roles",
	});

	const { data: fetchedApplications, isLoading: isLoadingApplications, isError: isErrorApplications } = useQuery({
		queryKey: ["applications"],
		queryFn: applicationService.fetchApplications,
	});

	useEffect(() => {
		if (fetchedApplications) {
			setAllApplications(fetchedApplications);
		}
	}, [fetchedApplications, setAllApplications]);

	useEffect(() => {
		if (allRoles) {
			replace(allRoles);
		}
	}, [allRoles, replace]);

	const handleClearSelectionAndForm = (callback?: () => void) => {
		setSelectedApplicationRowData(null);
		setSelectedRoleRowData(null);
		setAllRoles([]);
		reset(defaultFormValues);
		if (callback) callback();
	};

	const createApplicationMutation = useMutation({
		mutationFn: applicationService.createApplication,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["applications"] });
			enqueueSnackbar(`Application '${data.appName}' created successfully`, {
				variant: "success",
			});
			// The component calling this will handle dialog closing if needed
			handleClearSelectionAndForm(); 
		},
		onError: (error) => {
			console.error("Error creating application:", error);
			enqueueSnackbar(`Error creating application: ${error.message}`, {
				variant: "error",
			});
		},
	});

	const updateApplicationMutation = useMutation({
		mutationFn: applicationService.updateApplication,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["applications"] });
			enqueueSnackbar(`Application '${data.appName}' updated successfully`, {
				variant: "success",
			});
			// The component calling this will handle dialog closing if needed
			handleClearSelectionAndForm(); 
		},
		onError: (error) => {
			console.error("Error updating application:", error);
			enqueueSnackbar(`Error updating application: ${error.message}`, {
				variant: "error",
			});
		},
	});

	const deleteApplicationMutation = useMutation({
		mutationFn: applicationService.deleteApplication,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["applications"] });
			enqueueSnackbar(`Application with ID ${data.appId} deleted successfully`, {
				variant: "success",
			});
			if (selectedApplicationRowData?.appId === data.appId) {
				handleClearSelectionAndForm();
			}
		},
		onError: (error) => {
			console.error("Error deleting application:", error);
			enqueueSnackbar(`Error deleting application: ${error.message}`, {
				variant: "error",
			});
		},
	});

	useEffect(() => {
		if (selectedApplicationRowData) {
			setAllRoles(selectedApplicationRowData.roles || []);
			reset(selectedApplicationRowData); // Reset form with selected app data
		} else {
			// This case is handled by handleClearSelectionAndForm for explicit clearing
			// If selectedApplicationRowData becomes null by other means, ensure form is default.
			// reset(defaultFormValues); // This might be redundant if clearing is always explicit.
		}
	}, [selectedApplicationRowData, setAllRoles, reset]);


	const submitApplicationForm = async (onSuccessCallback?: () => void) => {
		await trigger(); // Manually trigger validation
		if (formState.isValid) {
			const data = getValues();
			if (selectedApplicationRowData) {
				console.log({data})
				const updateData = { ...data, appId: selectedApplicationRowData.appId };
				updateApplicationMutation.mutate(updateData, {
					onSuccess: (responseData) => {
						handleClearSelectionAndForm(); // Clear selection and form on success
						if (onSuccessCallback) onSuccessCallback(); 
					}
				});
			} else {
				createApplicationMutation.mutate(data, {
					onSuccess: (responseData) => {
						handleClearSelectionAndForm(); // Clear selection and form on success
						if (onSuccessCallback) onSuccessCallback();
					}
				});
			}
		} else {
			enqueueSnackbar("Please fill in all required fields", {
				variant: "error",
			});
		}
	};

	const handleSetSelectedApplication = (app: z.input<typeof maintainAppsSchema> | null) => {
		setSelectedApplicationRowData(app);
		// Form reset and role setting is handled by the useEffect watching selectedApplicationRowData
	};

	return {
		applications: allApplications,
		isLoadingApplications,
		isErrorApplications,
		appForm,
		control,
		resetForm: reset, // Renaming for clarity if needed, or just use appForm.reset
		triggerFormValidation: trigger,
		getFormValues: getValues,
		appendRoleToForm: append,
		removeRoleFromForm: remove,
		createApplication: createApplicationMutation, // Expose mutation objects directly
		updateApplication: updateApplicationMutation,
		deleteApplication: deleteApplicationMutation,
		submitApplicationForm,
		handleSetSelectedApplication,
		handleClearSelectionAndForm,
		selectedApplication: selectedApplicationRowData,
		isSubmittingApplication: createApplicationMutation.isPending || updateApplicationMutation.isPending,
	};
} 