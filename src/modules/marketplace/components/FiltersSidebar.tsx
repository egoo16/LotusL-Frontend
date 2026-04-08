'use client';

import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
} from '@mui/material';
import { ExpandMore, Clear } from '@mui/icons-material';

interface FiltersState {
  search: string;
  category: string;
  author: string;
  language: string;
  priceRange: [number, number];
  condition: {
    new: boolean;
    used: boolean;
  };
}

interface FiltersSidebarProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
  categories?: string[];
  languages?: string[];
}

const categories = [
  'Ficción',
  'No Ficción',
  'Ciencia',
  'Historia',
  'Arte',
  'Música',
  ' Tecnología',
  'Negocios',
  'Autoayuda',
  'Biografía',
  'Poesía',
  'Otro',
];

const languages = [
  'Español',
  'Inglés',
  'Francés',
  'Alemán',
  'Portugués',
  'Otro',
];

export function FiltersSidebar({
  filters,
  onChange,
  categories: categoriesProp,
  languages: languagesProp,
}: FiltersSidebarProps) {
  const handleFilterChange = (key: keyof FiltersState, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const handleConditionChange = (type: 'new' | 'used') => {
    onChange({
      ...filters,
      condition: {
        ...filters.condition,
        [type]: !filters.condition[type],
      },
    });
  };

  const handleClearFilters = () => {
    onChange({
      search: '',
      category: '',
      author: '',
      language: '',
      priceRange: [0, 1000],
      condition: { new: false, used: false },
    });
  };

  const hasFilters =
    filters.search ||
    filters.category ||
    filters.author ||
    filters.language ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000 ||
    filters.condition.new ||
    filters.condition.used;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Filtros
        </Typography>
        {hasFilters && (
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={handleClearFilters}
          >
            Limpiar
          </Button>
        )}
      </Box>

      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="medium">Búsqueda</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por título..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por autor..."
            value={filters.author}
            onChange={(e) => handleFilterChange('author', e.target.value)}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="medium">Categoría</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Categoría</InputLabel>
            <Select
              value={filters.category}
              label="Categoría"
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {(categoriesProp || categories).map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="medium">Idioma</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Idioma</InputLabel>
            <Select
              value={filters.language}
              label="Idioma"
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {(languagesProp || languages).map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="medium">Precio</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={filters.priceRange}
              onChange={(_, value) =>
                handleFilterChange('priceRange', value as [number, number])
              }
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `Q${value}`}
              min={0}
              max={1000}
              step={10}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">
                Q{filters.priceRange[0]}
              </Typography>
              <Typography variant="caption">
                Q{filters.priceRange[1]}
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight="medium">Condición</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.condition.new}
                onChange={() => handleConditionChange('new')}
                color="primary"
              />
            }
            label="Nuevo"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.condition.used}
                onChange={() => handleConditionChange('used')}
                color="primary"
              />
            }
            label="Usado"
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
