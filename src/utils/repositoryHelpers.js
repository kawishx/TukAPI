export const combineWhere = (...clauses) => {
  const filteredClauses = clauses.filter((clause) => clause && Object.keys(clause).length > 0);

  if (filteredClauses.length === 0) {
    return {};
  }

  if (filteredClauses.length === 1) {
    return filteredClauses[0];
  }

  return {
    AND: filteredClauses,
  };
};

export const buildSearchWhere = (search, fields) => {
  if (!search) {
    return {};
  }

  return {
    OR: fields.map((field) => {
      if (typeof field === 'string') {
        return {
          [field]: {
            contains: search,
            mode: 'insensitive',
          },
        };
      }

      return field(search);
    }),
  };
};

export const resolveLastModified = (records, candidateFields = ['updatedAt', 'createdAt', 'recordedAt']) => {
  if (!records || records.length === 0) {
    return null;
  }

  const resolveCandidate = (record) => {
    for (const field of candidateFields) {
      if (record[field]) {
        return record[field];
      }
    }

    return null;
  };

  const initialValue = resolveCandidate(records[0]);

  if (!initialValue) {
    return null;
  }

  return records.reduce((latest, record) => {
    const candidate = resolveCandidate(record);
    return candidate && candidate > latest ? candidate : latest;
  }, initialValue);
};

