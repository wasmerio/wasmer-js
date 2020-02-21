// Fetch Command Function to fetch a command from WAPM

const WAPM_GRAPHQL_QUERY = `query shellGetCommandQuery($command: String!) {
  command: getCommand(name: $command) {
    command
    module {
      abi
      publicUrl
    }
    packageVersion {
      package {
        displayName
      }
    }
  }
}`;

const getWAPMUrlForCommandName = async (commandName: string) => {
  const fetchResponse = await fetch("https://registry.wapm.io/graphql", {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      operationName: "shellGetCommandQuery",
      query: WAPM_GRAPHQL_QUERY,
      variables: {
        command: commandName
      }
    })
  });
  const response = await fetchResponse.json();

  const optionalChaining = (baseObject: any, chain: Array<string>): any => {
    const newObject = baseObject[chain[0]];
    chain.shift();
    if (newObject) {
      if (chain.length > 1) {
        return optionalChaining(newObject, chain);
      }

      return true;
    }
    return false;
  };

  if (optionalChaining(response, ["data", "command", "module", "publicUrl"])) {
    const wapmModule = response.data.command.module;

    if (wapmModule.abi !== "wasi") {
      throw new Error(
        `${commandName} does not use the wasi abi. Currently, only the wasi abi is supported on the wapm shell.`
      );
    }

    return wapmModule.publicUrl;
  } else {
    throw new Error(`command not found ${commandName}`);
  }
};

const getWasmBinaryFromUrl = async (url: string) => {
  const fetched = await fetch(url);
  const buffer = await fetched.arrayBuffer();
  return new Uint8Array(buffer);
};

export const fetchCommandFromWAPM = async ({args,  env}: {
  args: Array<string>,
  env?: {[key: string]: string},
}) => {
  let commandName = args[0];
  const commandUrl = await getWAPMUrlForCommandName(commandName);
  return await getWasmBinaryFromUrl(commandUrl);
};
