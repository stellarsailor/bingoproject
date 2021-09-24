import React from 'react';
import { Input, Select } from 'antd';
import { useTranslation } from '../i18n';

const { Option } = Select;

export default function BingoCreateInformationPane(props) {
  const { t, i18n } = useTranslation();

  const {
    categoryList,
    bingoCategory,
    setBingoCategory,
    bingoTitle,
    setBingoTitle,
    bingoDescription,
    setBingoDescription,
  } = props;

  return (
    <>
      <Select
        placeholder={t('CREATE_PLACEHOLDER_CATEGORY')}
        style={{ width: 200, margin: '1rem 0px', marginRight: 16 }}
        onChange={(v) => setBingoCategory(v)}
        value={bingoCategory}
      >
        {categoryList.slice(1).map((v, index) => (
          <Option key={v.id} value={v.id}>
            {v[`name_${i18n.language}`]}
          </Option>
        ))}
      </Select>

      <Input
        placeholder={t('CREATE_PLACEHOLDER_TITLE')}
        value={bingoTitle}
        onChange={(e) => setBingoTitle(e.target.value)}
        style={{ width: '100%', height: 40, borderRadius: 5 }}
      />

      <Input
        placeholder={t('CREATE_PLACEHOLDER_DESC')}
        value={bingoDescription}
        onChange={(e) => setBingoDescription(e.target.value)}
        style={{
          width: '100%',
          height: 35,
          margin: '1rem 0px',
          borderRadius: 5,
        }}
      />
    </>
  );
}
