export const calculateDeductions = (employee) => {
    let totalDeduction = 0;
    
    if (employee.is_active === 'Active' || employee.is_active === 'Hold' || employee.is_active === 'Notice' || employee.is_active === 'Inactive') {
        totalDeduction += 10;
    }

    
    if (!employee.dependents) return totalDeduction;

    
    if (employee.dependents.spouse_name && employee.dependents.spouse_status === 'Active') {
        totalDeduction += 10;
    }

    ['dependent1', 'dependent2'].forEach(dep => {
        if (employee.dependents[`${dep}_name`] && employee.dependents[`${dep}_status`] === 'Active') {
            totalDeduction += 10;
        }
    });

    ['father', 'mother'].forEach(parent => {
        if (employee.dependents[`${parent}_name`] && employee.dependents[`${parent}_status`] === 'Active') {
            totalDeduction += 50;
        }
    });
    
    ['additional_dependent1', 'additional_dependent2', 'additional_dependent3'].forEach(dep => {
        if (employee.dependents[`${dep}_name`] && employee.dependents[`${dep}_status`] === 'Active') {
            totalDeduction += 30;
        }
    });

     // Special case for Consultant
     if (employee.category === 'Consultant') {
        totalDeduction = 3000; // Set to 3000 for Consultants
        if (employee.dependents.additional_dependent3_name && employee.dependents.additional_dependent3_status === 'Active') {
            totalDeduction += 500; // Add 500 for the 3rd dependent if active
        }
    }
    return totalDeduction;
}; 