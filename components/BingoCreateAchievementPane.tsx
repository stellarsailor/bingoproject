import React, { useCallback, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Input,
  Radio,
  Select,
  Modal,
  InputNumber,
  Button,
  message,
  Slider,
  Checkbox,
} from 'antd';
import styled from 'styled-components';
import { useTranslation } from '../i18n';

const marks = [
  { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '' },
  {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: '11',
    12: '12',
    13: '',
  },
];

export default function BingoCreateAchievementPane(props) {
  const { t, i18n } = useTranslation();

  const {
    enableAchievement,
    bingoAchievement,
    setBingoAchievement,
    bingoSize,
  } = props;

  const [achievementInput, setAchievementInput] = useState('');
  const [achievementMinimumPointer, setAchievementMinimumPointer] = useState(1);
  const [achievementPointer, setAchievementPointer] = useState(1);

  useEffect(() => {
    if (!enableAchievement) {
      //when becomes false, reset achievement, consider number.
      let tempArrToReset = [];
      tempArrToReset.push({
        breakPoint: 5, //0~5체크 이하, 노 빙고 6체크 이상
        preBreakPoint: '',
        postBreakPoint: '',
      });

      for (let i = 1; i < bingoSize * 2 + 2 + 1; i++) {
        tempArrToReset.push('');
      }

      setBingoAchievement(tempArrToReset);
      // handleAchievement(1, bingoSize * 2 + 2 + 1, '')
    }
  }, [enableAchievement]);

  const handleAchievement = useCallback(
    (rangeMin, rangeMax, value) => {
      for (let i = rangeMin; i < rangeMax; i++) {
        bingoAchievement[i] = value;
      }
      setBingoAchievement([...bingoAchievement]);
      setAchievementMinimumPointer(rangeMax);
      setAchievementPointer(bingoSize * 2 + 2);
      setAchievementInput('');
    },
    [bingoAchievement]
  );

  const handleZeroBingoAchievement = useCallback(
    (property, value) => {
      let obj = {};
      if (typeof bingoAchievement[0] === 'string') {
        obj = { breakPoint: 5, preBreakPoint: '', postBreakPoint: '' };
      } else {
        obj = bingoAchievement[0];
      }
      bingoAchievement.shift();

      obj[property] = value;

      let concatedArray = [obj].concat(bingoAchievement);
      setBingoAchievement(concatedArray);
    },
    [bingoAchievement]
  );

  return (
    <>
      {enableAchievement && (
        <>
          <TextLabel>{t('CREATE_BINGO_ACCOMPLISHMENTS_HELP')}</TextLabel>
          {bingoAchievement.map((v, index) => {
            if (index === 0) {
              return (
                <div key={index}>
                  {t('CREATE_BINGO_ACCOMPLISHMENTS_BREAKPOINT')}:{' '}
                  <InputNumber
                    min={1}
                    max={bingoSize * 2}
                    defaultValue={v.breakPoint}
                    onChange={(v) =>
                      handleZeroBingoAchievement('breakPoint', v)
                    }
                    style={{ width: 60, marginLeft: 8 }}
                  />
                  <div>
                    0 {t('STATIC_BINGO')} & {v.breakPoint}{' '}
                    {t('CREATE_BINGO_ACCOMPLISHMENTS_LESSEQUAL')}:
                    <Input
                      style={{ width: '50%', marginLeft: 8 }}
                      value={v.preBreakPoint}
                      onChange={(e) =>
                        handleZeroBingoAchievement(
                          'preBreakPoint',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    0 {t('STATIC_BINGO')} & {v.breakPoint + 1}{' '}
                    {t('CREATE_BINGO_ACCOMPLISHMENTS_GREATER')}:
                    <Input
                      style={{ width: '50%', marginLeft: 8 }}
                      value={v.postBreakPoint}
                      onChange={(e) =>
                        handleZeroBingoAchievement(
                          'postBreakPoint',
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index}>
                  {index} {t('STATIC_BINGO')}: {v}
                </div>
              );
            }
          })}
          {achievementMinimumPointer === 0 ? (
            <div>
              <Slider
                defaultValue={achievementPointer}
                min={1}
                max={bingoSize * 2 + 2 + 1}
                onChange={(v) => setAchievementPointer(v)}
                marks={bingoSize === 3 ? marks[0] : marks[1]}
              />
              <Input
                style={{ width: '70%' }}
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                onPressEnter={() => {
                  handleAchievement(0, achievementPointer, achievementInput);
                }}
              />
              <Button
                style={{ marginLeft: '1rem' }}
                onClick={() => {
                  handleAchievement(0, achievementPointer, achievementInput);
                }}
              >
                {t('STATIC_ADD')}
              </Button>
            </div>
          ) : (
            <div>
              <Slider
                range
                value={[achievementMinimumPointer, achievementPointer]}
                min={1}
                max={bingoSize * 2 + 2 + 1}
                onChange={(v) => {
                  setAchievementMinimumPointer(v[0]);
                  setAchievementPointer(v[1]);
                }}
                marks={bingoSize === 3 ? marks[0] : marks[1]}
              />
              <Input
                style={{ width: '70%' }}
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                onPressEnter={() => {
                  handleAchievement(
                    achievementMinimumPointer,
                    achievementPointer,
                    achievementInput
                  );
                }}
              />
              <Button
                style={{ marginLeft: '1rem' }}
                onClick={() => {
                  handleAchievement(
                    achievementMinimumPointer,
                    achievementPointer,
                    achievementInput
                  );
                }}
              >
                {t('STATIC_ADD')}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}

const TextLabel = styled.div`
  /* color: ${(props) =>
    props.reverse ? 'var(--mono-7)' : 'var(--mono-2)'}; */
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 8px;
`;
