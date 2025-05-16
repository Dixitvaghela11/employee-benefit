export const formatRelation = (relation) => {
    const relationMap = {
        'spouse': 'Spouse',
        'dependent1': '1st Son / Daughter',
        'dependent2': '2nd Son / Daughter',
        'father': 'Father / Father-in-law',
        'mother': 'Mother / Mother-in-law',
        'additional_dependent1': 'Additional Son / Daughter 1',
        'additional_dependent2': 'Additional Son / Daughter 2',
        'additional_dependent3': 'Additional Son / Daughter 3'
    };
    return relationMap[relation] || relation;
};
