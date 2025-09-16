import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const commands = [
	new SlashCommandBuilder()
		.setName('fen')
		.setDescription('fenna tutti gli utenti col ruolo')
		.addStringOption((option) =>
			option
				.setName('custom_message')
				.setDescription('Custom message to send (default: "fen")')
				.setRequired(false),
		),
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
	try {
		console.log('Registering slash commands...');

		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
			body: commands.map((command) => command.toJSON()),
		});

		console.log('Slash commands registered successfully');
	} catch (error) {
		console.error(error);
	}
})();
