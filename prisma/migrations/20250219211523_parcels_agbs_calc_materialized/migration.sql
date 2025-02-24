CREATE OR REPLACE VIEW total_impact AS
 SELECT sum((("Project"."values" -> 'impact'::text) ->> 'value'::text)::integer) AS total_impact
   FROM "Project"
  WHERE (("Project"."values" -> 'impact'::text) ->> 'value'::text) IS NOT NULL;
  
CREATE OR REPLACE VIEW total_investment AS
 SELECT sum((("Project"."values" -> 'total_investment'::text) ->> 'value'::text)::integer) AS total_investment
   FROM "Project"
  WHERE (("Project"."values" -> 'total_investment'::text) ->> 'value'::text) IS NOT NULL;

CREATE OR REPLACE VIEW total_bankable_investment AS
 SELECT sum((("Project"."values" -> 'bankable_investment'::text) ->> 'value'::text)::integer) AS total_bankable_investment
   FROM "Project"
  WHERE (("Project"."values" -> 'bankable_investment'::text) ->> 'value'::text) IS NOT NULL;
  
CREATE OR REPLACE VIEW total_income AS
 SELECT sum((("Project"."values" -> 'income'::text) ->> 'value'::text)::integer) AS total_income
   FROM "Project"
  WHERE (("Project"."values" -> 'income'::text) ->> 'value'::text) IS NOT NULL;

CREATE OR REPLACE VIEW species_calculation AS
  WITH base_values AS (
         SELECT s.id AS species_id,
            s.common_name,
            ((s."values" -> 'allometric_coeff_a'::text) ->> 'value'::text)::numeric AS allometric_coeff_a,
            ((s."values" -> 'avg_dbh'::text) ->> 'value'::text)::numeric AS avg_dbh,
            ((s."values" -> 'allometric_coeff_b'::text) ->> 'value'::text)::numeric AS allometric_coeff_b,
            ((s."values" -> 'r_coeff'::text) ->> 'value'::text)::numeric AS r_coeff
           FROM "Species" s
        ), agb_calc AS (
         SELECT base_values.species_id,
            base_values.common_name,
            base_values.allometric_coeff_a,
            base_values.avg_dbh,
            base_values.allometric_coeff_b,
            base_values.r_coeff,
            base_values.allometric_coeff_a * (base_values.avg_dbh ^ base_values.allometric_coeff_b) AS agb_species
           FROM base_values
        ), bgb_calc AS (
         SELECT agb_calc.species_id,
            agb_calc.common_name,
            agb_calc.allometric_coeff_a,
            agb_calc.avg_dbh,
            agb_calc.allometric_coeff_b,
            agb_calc.r_coeff,
            agb_calc.agb_species,
            agb_calc.agb_species * agb_calc.r_coeff AS bgb_species
           FROM agb_calc
        ), co2_calc AS (
         SELECT bgb_calc.species_id,
            bgb_calc.common_name,
            bgb_calc.allometric_coeff_a,
            bgb_calc.avg_dbh,
            bgb_calc.allometric_coeff_b,
            bgb_calc.r_coeff,
            bgb_calc.agb_species,
            bgb_calc.bgb_species,
            bgb_calc.agb_species * 0.47 * 44::numeric / 12::numeric AS co2eq_captured,
            bgb_calc.bgb_species * 0.47 * 44::numeric / 12::numeric AS co2eq_subt
           FROM bgb_calc
        )
 SELECT co2_calc.species_id,
    co2_calc.common_name,
    co2_calc.allometric_coeff_a,
    co2_calc.avg_dbh,
    co2_calc.allometric_coeff_b,
    co2_calc.r_coeff,
    co2_calc.agb_species,
    co2_calc.bgb_species,
    co2_calc.co2eq_captured,
    co2_calc.co2eq_subt
   FROM co2_calc;

CREATE OR REPLACE FUNCTION generate_species_data(
    species_names TEXT[], -- Array of species names
    max_year INT,
    OUT year INT,
    OUT species TEXT,
    OUT growth_model TEXT,
    OUT altura NUMERIC,
    OUT diametro NUMERIC,
    OUT agb NUMERIC,
    OUT bgb NUMERIC,
    OUT co2eq NUMERIC,
    OUT delta_co2 NUMERIC
) RETURNS SETOF RECORD AS $$
DECLARE
    species_name TEXT; -- Variable to store the current species name
    max_h NUMERIC;
    g_b NUMERIC;
    g_c NUMERIC;
    avg_dbh NUMERIC;
    g_b_dbh NUMERIC;
    g_c_dbh NUMERIC;
    allometric_a NUMERIC;
    allometric_b NUMERIC;
    r_coefficient NUMERIC;
    prev_agb_bgb NUMERIC := NULL;
BEGIN
    -- Ensure max_year does not exceed 50
    IF max_year > 50 THEN
        max_year := 50;
    END IF;

    -- Loop through each species in the array
    FOR species_name IN SELECT UNNEST(species_names) LOOP

        -- Get species parameters
        SELECT 
            (values -> 'max_height' ->> 'value')::NUMERIC,
            (values -> 'g_b' ->> 'value')::NUMERIC,
            (values -> 'g_c' ->> 'value')::NUMERIC,
            (values -> 'avg_dbh' ->> 'value')::NUMERIC,
            (values -> 'g_b_dbh' ->> 'value')::NUMERIC,
            (values -> 'g_c_dbh' ->> 'value')::NUMERIC,
            (values -> 'allometric_coeff_a' ->> 'value')::NUMERIC,
            (values -> 'allometric_coeff_b' ->> 'value')::NUMERIC,
            (values -> 'r_coeff' ->> 'value')::NUMERIC
        INTO max_h, g_b, g_c, avg_dbh, g_b_dbh, g_c_dbh, allometric_a, allometric_b, r_coefficient
        FROM "Species"
        WHERE common_name = species_name;

        -- If species not found, skip to the next species
        IF NOT FOUND THEN
            CONTINUE;
        END IF;

        -- Loop through years 0 to max_year
        FOR y IN 0..max_year LOOP
            -- Assign OUT parameter values
            year := y;
            species := species_name;
            growth_model := 'G-Gompertz';

            -- Compute height (Altura(t))
            altura := max_h * EXP(- g_b * EXP(- g_c * y));

            -- Compute diameter (Diámetro(t))
            diametro := avg_dbh * EXP(- g_b_dbh * EXP(- g_c_dbh * y));

            -- Compute Above-Ground Biomass (AGB)
            agb := allometric_a * POWER(diametro, allometric_b);

            -- Compute Below-Ground Biomass (BGB)
            bgb := agb * r_coefficient;

            -- Compute CO2 Equivalent (AGB + BGB)
            co2eq := (agb + bgb) * 0.47 * 44 / 12;

            -- Compute Delta T (Yearly Increase in Biomass)
            IF delta_co2 IS NULL THEN
                delta_co2 := co2eq;
            ELSE
                delta_co2 := co2eq - delta_co2;
            END IF;

            -- Return the row
            RETURN NEXT;
        END LOOP;

    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_parcel_co2eq(
    max_year INT
)
RETURNS TABLE (
    parcel_id UUID,
    parcel_name TEXT,
    year INT,
    co2eq_ton NUMERIC
) AS $$
DECLARE
    retrieved_species_name TEXT[];
BEGIN
    -- Ensure max_year does not exceed 50 for generate_species_data
    IF max_year > 50 THEN
        max_year := 50;
    END IF;

    -- Loop through all parcels and their associated species
    RETURN QUERY
    SELECT 
        p.parcel_id,
        p.parcel_name,
        g.year,
        (p.individuals * g.delta_co2) / 1000 AS co2eq_ton
    FROM 
        parcels_agbs_calculations p
    CROSS JOIN 
        LATERAL generate_species_data(STRING_TO_ARRAY(p.species, ', '), max_year) g
    WHERE 
        g.year BETWEEN 0 AND max_year;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE parcels_agbs_calculations_materialized()
LANGUAGE plpgsql
AS $$
DECLARE 
    project_row RECORD;
    project_id_sanitized TEXT;
    sql_stmt TEXT;
    index_stmt TEXT;
    view_exists BOOLEAN;
    index_exists BOOLEAN;
BEGIN
    FOR project_row IN (SELECT DISTINCT "id" FROM "Project") LOOP
        -- Sanitize UUID: Remove hyphens and truncate to 20 characters
        project_id_sanitized := left(replace(project_row."id"::TEXT, '-', ''), 20);
        
        -- Check if the materialized view already exists
        SELECT EXISTS (
            SELECT 1 FROM pg_matviews WHERE matviewname = 'parcels_agbs_project_' || project_id_sanitized
        ) INTO view_exists;

        -- If the materialized view does not exist, create it
        IF NOT view_exists THEN
            sql_stmt := 'CREATE MATERIALIZED VIEW parcels_agbs_project_' || project_id_sanitized || ' AS
                WITH base_values AS (
                    SELECT p.id AS parcel_id,
                           p.name AS parcel_name,
                           e.type AS ecosystem,
                           sc.common_name AS species,
                           p.area,
                           p.area_factor * p.area AS individuals,
                           ((s."values" -> ''r_coeff'') ->> ''value'')::numeric AS r_coeff,
                           sc.agb_species,
                           p.area::numeric * (((e."values" -> ''SOC'') ->> ''value'')::numeric) AS parcel_soc_total
                    FROM "Parcels" p
                    LEFT JOIN "Species" s ON p."speciesId" = s.id
                    LEFT JOIN species_calculation sc ON s.id = sc.species_id
                    LEFT JOIN "Ecosystem" e ON p."ecosystemId" = e.id
                    LEFT JOIN "Project" pr ON pr.id = p."projectId"
                    WHERE p."projectId" = ''' || project_row."id" || '''
                ), parcel_agb_calc AS (
                    SELECT *, (base_values.individuals)::numeric * base_values.agb_species / 1000::numeric AS parcel_agb
                    FROM base_values
                ), parcel_bgb_calc AS (
                    SELECT *, parcel_agb * r_coeff AS parcel_bgb
                    FROM parcel_agb_calc
                ), parcel_co2_calcs AS (
                    SELECT *, parcel_agb * 0.47 * 44::numeric / 12::numeric AS parcel_co2eq_captured,
                              parcel_bgb * 0.47 * 44::numeric / 12::numeric AS parcel_co2eq_subt
                    FROM parcel_bgb_calc
                ), parcel_co2_total AS (
                    SELECT *, (parcel_co2eq_captured + parcel_co2eq_subt) * 1000::numeric AS parcel_co2eq_total,
                              parcel_co2eq_captured + parcel_co2eq_subt + parcel_soc_total AS parcel_total_carbon
                    FROM parcel_co2_calcs
                ), parcel_carbon_total AS (
                    SELECT *, parcel_total_carbon - parcel_soc_total AS parcel_co2_additional
                    FROM parcel_co2_total
                )
                SELECT parcel_id,
                       parcel_name,
                       ecosystem,
                       species,
                       area,
                       individuals,
                       parcel_agb,
                       parcel_bgb,
                       parcel_co2eq_captured,
                       parcel_co2eq_subt,
                       parcel_co2eq_total,
                       parcel_soc_total,
                       parcel_total_carbon,
                       parcel_co2_additional 
                FROM parcel_carbon_total;';

            -- Execute creation
            EXECUTE sql_stmt;
        ELSE
            -- If the view exists, refresh it instead of creating a new one
            EXECUTE 'REFRESH MATERIALIZED VIEW parcels_agbs_project_' || project_id_sanitized;
        END IF;

        -- Check if index exists
        SELECT EXISTS (
            SELECT 1 FROM pg_indexes WHERE indexname = 'idx_parcels_agbs_project_' || project_id_sanitized
        ) INTO index_exists;

        -- If index does not exist, create it
        IF NOT index_exists THEN
            index_stmt := 'CREATE INDEX idx_parcels_agbs_project_' || project_id_sanitized ||
                          ' ON parcels_agbs_project_' || project_id_sanitized || ' (parcel_id);';
            EXECUTE index_stmt;
        END IF;
    END LOOP;
END $$;

CREATE OR REPLACE PROCEDURE parcels_co2eq_materialized()
LANGUAGE plpgsql
AS $$ 
DECLARE 
    project_row RECORD;
    project_id_sanitized TEXT;
    sql_stmt TEXT;
    index_stmt TEXT;
    view_exists BOOLEAN;
    index_exists BOOLEAN;
BEGIN
    FOR project_row IN (SELECT DISTINCT "id" FROM "Project") LOOP
        -- Sanitize UUID: Remove hyphens and truncate to 20 characters
        project_id_sanitized := left(replace(project_row."id"::TEXT, '-', ''), 20);

        -- Check if the materialized view already exists
        SELECT EXISTS (
            SELECT 1 FROM pg_matviews WHERE matviewname = 'parcels_co2eq_project_' || project_id_sanitized
        ) INTO view_exists;

        -- If the materialized view does not exist, create it
        IF NOT view_exists THEN
            sql_stmt := 'CREATE MATERIALIZED VIEW parcels_co2eq_project_' || project_id_sanitized || ' AS
                SELECT 
                    p.parcel_id,
                    p.parcel_name,
                    p.ecosystem,
                    p.species,
                    g.year,
                    (p.individuals * g.delta_co2) / 1000 AS co2eq_ton
                FROM 
                    parcels_agbs_project_' || project_id_sanitized || ' p
                CROSS JOIN 
                    LATERAL generate_species_data(STRING_TO_ARRAY(p.species, '', ''), 20) g'; 
            
            EXECUTE sql_stmt;
        ELSE
            -- If the view exists, refresh it instead of creating a new one
            EXECUTE 'REFRESH MATERIALIZED VIEW parcels_co2eq_project_' || project_id_sanitized;
        END IF;

        -- Check if index exists
        SELECT EXISTS (
            SELECT 1 FROM pg_indexes WHERE indexname = 'idx_parcels_co2eq_project_' || project_id_sanitized
        ) INTO index_exists;

        -- If index does not exist, create it
        IF NOT index_exists THEN
            index_stmt := 'CREATE INDEX idx_parcels_co2eq_project_' || project_id_sanitized ||
                          ' ON parcels_co2eq_project_' || project_id_sanitized || ' (parcel_id);';
            EXECUTE index_stmt;
        END IF;
    END LOOP;
END $$;

