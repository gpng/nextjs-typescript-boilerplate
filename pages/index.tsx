import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Thead,
  Tr,
} from '@chakra-ui/react';
import axios from 'axios';
import { FC, useState } from 'react';

const RESOURCE_IDS: string[] = [
  '6b5cbfa7-b502-4ce6-875d-dafff7ff04f2',
  '3b8539bb-5c22-4540-a420-86db444810d3',
  '9458197b-4b46-480e-a596-34dbff26d8dc',
  '61a4bfe4-6cf6-4aa0-8c7c-05e53bddd182',
  'b8e67c3e-2876-48d7-930b-6702bbdac16c',
  'ada9a1fa-c1d8-41a0-80f6-982334c1cf32',
  'c5fdba9e-5e7c-47b3-9f47-bdd5266a3a9b',
  '86d54336-c9ef-48a8-9f6b-47053aa5c223',
  '250da61b-4509-4b15-a084-49b1935438af',
  '2e484f26-d31c-4484-9033-77d307025a3e',
  '269d499f-8173-44ae-b956-14d7bd2014d4',
  'fef20b0b-a8bf-4ac5-b8f9-280a05d7537a',
  '8bb8c3ef-8562-4ab0-8853-200fa82587d7',
  '38282e84-8a21-4932-a968-fe04a3bee4d0',
  '24986e7f-17bf-4058-a247-5b916e213ff5',
  '67e879b2-84e4-4353-9904-3fa3c004deba',
  '67727849-f41c-4eff-b5c0-d58c0f6b468e',
  'c666507e-44e2-49fa-a86c-2719c14bbbdc',
  '855613c8-c1cf-4b54-9ec4-2ae15b798a44',
  'b533039b-5002-4f45-bd11-632c47f7cdfa',
  '15ffcdd1-6cc9-48d6-bbb4-cfc7e9b0aa46',
  'a740cd7d-8c08-4825-bcdc-b5c8d2a80a81',
  '15b43f42-139c-4c31-a607-44c20f44d1c1',
  '15b43f42-139c-4c31-a607-44c20f44d1c1',
  // '903aa558-bf4b-4ab0-8eed-5a5a00af0618',
  '4629432d-6bbd-4381-88b3-1dd2dabb0c18',
  // 'eaa3a71f-6bc9-40a1-a1c6-baf034dc1ac0',
  'e8732ea3-adca-4ca0-9fef-2b90c7a24f06',
];

interface Result {
  uen: string;
  entityName: string;
  entityStatusDescription: string;
  primarySsicDescription: string;
  secondarySsicDescription: string;
}

const jsonToResult = (json: Record<string, unknown>): Result => {
  return {
    uen: json['uen'] as string,
    entityName: json['entity_name'] as string,
    entityStatusDescription: json['entity_status_description'] as string,
    primarySsicDescription: json['primary_ssic_description'] as string,
    secondarySsicDescription: json['secondary_ssic_description'] as string,
  };
};

const searchOne = async (value: string): Promise<Result[]> => {
  const results = [];
  const promises = RESOURCE_IDS.map((resourceId) => {
    return axios
      .get(
        `https://data.gov.sg/api/action/datastore_search?resource_id=${resourceId}&limit=5&q=${encodeURIComponent(
          value,
        )}`,
      )
      .then((res) => {
        if (res.data.result?.records?.length > 0) {
          results.push(...res.data.result.records.map(jsonToResult));
        }
      });
  });

  await Promise.all(promises);

  return results;
};

const Index: FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Result[]>([]);

  const handleSearch = async (): Promise<void> => {
    setIsLoading(true);

    const values = input
      .split('\n')
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    setSearchResults(
      values.map((value) => ({
        uen: value,
        entityName: 'loading',
        entityStatusDescription: 'loading',
        primarySsicDescription: 'loading',
        secondarySsicDescription: 'loading',
      })),
    );

    for (let i = 0; i < values.length; i += 1) {
      await searchOne(values[i]).then((results) => {
        setSearchResults((currResults) => {
          currResults[i] = results[0];
          return currResults;
        });
      });
    }

    setIsLoading(false);
  };

  return (
    <Container pt={10} maxW="full">
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          handleSearch();
        }}
      >
        <FormControl>
          <FormLabel>Search</FormLabel>
          <Textarea value={input} onChange={(ev) => setInput(ev.target.value)} />
        </FormControl>
        <Button type="submit" isLoading={isLoading} mt={2}>
          Search
        </Button>
      </form>
      <TableContainer mt={4}>
        <Table>
          <Thead>
            <Tr>
              <Td>UEN</Td>
              <Td>Entity Name</Td>
              <Td>Entity Status</Td>
              <Td>Primary SSIC Description</Td>
              <Td>Secondary SSIC Description</Td>
            </Tr>
          </Thead>
          <Tbody>
            {searchResults.map((searchResult) => (
              <Tr key={searchResult.uen}>
                <Td>{searchResult.uen}</Td>
                <Td>{searchResult.entityName}</Td>
                <Td>{searchResult.entityStatusDescription}</Td>
                <Td>{searchResult.primarySsicDescription}</Td>
                <Td>{searchResult.secondarySsicDescription}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Index;
