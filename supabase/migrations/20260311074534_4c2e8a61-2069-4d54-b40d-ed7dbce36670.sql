-- Enable leaked password protection (update auth config)
ALTER ROLE authenticator SET pgrst.db_aggregates_enabled = 'true';